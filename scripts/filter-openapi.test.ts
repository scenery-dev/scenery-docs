import { describe, it, expect } from "vitest";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { filterSpec, loadAllow, loadFields, loadOverrides, loadParams, SNAPSHOT_PATH } from "./filter-openapi";
import { OUT_PATH, renderApi, loadSpec } from "./gen-api-ref";
import { loadConfig, runGuard } from "./content-guard";

const ok = (ref?: string) => ({
  "200": { description: "ok", content: ref ? { "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } } : undefined },
  "422": { description: "bad" },
});
const spec = (): any => ({
  openapi: "3.1.0",
  info: { title: "raw", version: "1" },
  servers: [{ url: "https://internal.example" }],
  paths: {
    "/a": {
      get: { operationId: "a_get", tags: ["x"], summary: "A", "x-internal": true, responses: ok("Outer") },
      post: { summary: "A post (not allowed)", responses: ok("OnlyPost") },
    },
    "/secret": { get: { summary: "Secret", responses: ok("Hidden") } },
  },
  components: {
    schemas: {
      Outer: { type: "object", description: "internal.example prose", properties: { inner: { $ref: "#/components/schemas/Inner" }, secret_field: { type: "string" } }, required: ["secret_field"] },
      Inner: { type: "object", properties: { n: { type: "string", description: "see internal.example" } } },
      OnlyPost: { type: "object" },
      Hidden: { type: "object" },
      Orphan: { type: "object" },
    },
    securitySchemes: { HTTPBearer: { type: "http", scheme: "bearer" } },
  },
});

describe("filterSpec", () => {
  const fields = { Outer: ["inner"], Inner: ["n"] };
  const out = filterSpec(spec(), ["GET /a"], {}, fields);
  it("keeps only allowlisted method+path pairs", () => {
    expect(Object.keys(out.paths)).toEqual(["/a"]);
    expect(Object.keys(out.paths["/a"])).toEqual(["get"]);
  });
  it("drops a non-allowlisted route that is in the input", () => {
    expect(JSON.stringify(out)).not.toContain("/secret");
    expect(JSON.stringify(out)).not.toContain("Hidden");
    expect(out.paths["/a"].post).toBeUndefined();
  });
  it("drops unreferenced schemas and keeps transitive ones", () => {
    expect(Object.keys(out.components.schemas).sort()).toEqual(["Inner", "Outer"]);
  });
  it("replaces servers", () => {
    expect(out.servers).toEqual([{ url: "https://app.scenery.dev" }]);
  });
  it("drops a raw field that is not allowlisted, by default", () => {
    expect(Object.keys(out.components.schemas.Outer.properties)).toEqual(["inner"]);
    expect(out.components.schemas.Outer.required).toEqual([]);
    const none = filterSpec(spec(), ["GET /a"]);
    expect(none.components.schemas.Outer.properties).toEqual({});
  });
  it("does not publish parameter patterns or enums unless curated", () => {
    const s = spec();
    s.paths["/a"].get.parameters = [
      { name: "sort", in: "query", schema: { type: "string", pattern: "^(ok|hidden_value)$" } },
      { name: "kind", in: "query", schema: { type: "string", enum: ["ok", "hidden_value"] } },
      { name: "n", in: "query", schema: { anyOf: [{ type: "string", enum: ["hidden_value"] }, { type: "null" }] } },
    ];
    const o = filterSpec(s, ["GET /a"], {}, fields, { "GET /a sort": ["ok"] });
    expect(JSON.stringify(o)).not.toContain("hidden_value");
    expect(o.paths["/a"].get.parameters[0].schema.enum).toEqual(["ok"]);
    expect(o.paths["/a"].get.parameters[1].schema.enum).toBeUndefined();
  });
  it("strips every description unless curated", () => {
    expect(JSON.stringify(out)).not.toContain("description");
  });
  it("renames generated schema names", () => {
    const s = spec();
    (s.components.schemas as any).Body_x_y_post = { type: "object", properties: { f: { type: "string" } } };
    (s.components.schemas as any).app__m__Req = { type: "object" };
    (s.paths["/a"].get as any).requestBody = { content: { "multipart/form-data": { schema: { $ref: "#/components/schemas/Body_x_y_post" } } } };
    (s.paths["/a"].get as any).parameters = [{ name: "q", in: "query", schema: { $ref: "#/components/schemas/app__m__Req" } }];
    const o = filterSpec(s, ["GET /a"], { "GET /a": ["Do a thing", "Curated."] }, { ...fields, DoAThingRequest: ["f"] });
    expect(Object.keys(o.components.schemas).sort()).toEqual(["DoAThingRequest", "Inner", "Outer", "Req"]);
    expect(JSON.stringify(o)).not.toContain("Body_");
    expect(JSON.stringify(o)).not.toContain("__");
  });
  it("strips vendor extensions, operation ids, tags, 422s and internal hosts", () => {
    const s = JSON.stringify(out);
    expect(s).not.toContain("x-internal");
    expect(s).not.toContain("a_get");
    expect(s).not.toContain("422");
    expect(s).not.toContain("internal.example");
    expect(s).not.toContain("secret_field");
  });
  it("uses curated operation text when given", () => {
    const o = filterSpec(spec(), ["GET /a"], { "GET /a": ["Nice", "Curated."] }, fields);
    expect(o.paths["/a"].get.summary).toBe("Nice");
    expect(o.paths["/a"].get.description).toBe("Curated.");
  });
});

describe("public API snapshot and page", () => {
  const allow = loadAllow();
  const fields = loadFields();
  const snap = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8"));
  it("snapshot contains exactly the allowlisted operations", () => {
    const found: string[] = [];
    for (const [p, i] of Object.entries<any>(snap.paths))
      for (const m of ["get", "post", "put", "patch", "delete"]) if (i[m]) found.push(`${m.toUpperCase()} ${p}`);
    expect(found.sort()).toEqual([...allow].sort());
    expect(snap.servers).toEqual([{ url: "https://app.scenery.dev" }]);
  });
  it("every operation has curated text", () => {
    const ov = loadOverrides();
    for (const a of allow) expect(ov[a], a).toBeTruthy();
  });
  it("snapshot publishes only allowlisted fields", () => {
    for (const [name, sch] of Object.entries<any>(snap.components.schemas))
      for (const k of Object.keys(sch.properties ?? {})) expect(fields[name] ?? [], `${name}.${k}`).toContain(k);
  });
  it("committed page is current", () => {
    expect(readFileSync(OUT_PATH, "utf8")).toBe(renderApi(loadSpec()));
  });
  it("rendered page passes the content guard", () => {
    const dir = mkdtempSync(join(tmpdir(), "api-ref-"));
    try {
      const f = join(dir, "api.md");
      writeFileSync(f, renderApi(loadSpec()));
      expect(runGuard([f], loadConfig())).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

/**
 * Reduces the registry's raw OpenAPI document to the public API surface.
 *
 *   npx tsx scripts/filter-openapi.ts /path/to/raw/openapi.json
 *
 * writes api/openapi.public.json. The raw spec is never stored in this repo:
 * keep it outside the checkout. Only `METHOD path` pairs listed in
 * api/public-routes.json survive; unreferenced schemas, vendor extensions,
 * operation ids/tags and all descriptions are removed. Schema fields are
 * allowlisted per schema in api/public-fields.json: a field that is not listed
 * is dropped, so new backend fields are private by default. Operation text
 * comes from api/public-descriptions.json (hand-written).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const ROUTES_PATH = join(here, "..", "api", "public-routes.json");
export const DESCRIPTIONS_PATH = join(here, "..", "api", "public-descriptions.json");
export const PARAMS_PATH = join(here, "..", "api", "public-params.json");
export const FIELDS_PATH = join(here, "..", "api", "public-fields.json");
export const SNAPSHOT_PATH = join(here, "..", "api", "openapi.public.json");
export const PUBLIC_SERVER = "https://app.scenery.dev";

type Json = any;
export type OpenAPIObject = Record<string, Json>;
export type Overrides = Record<string, [string, string]>;
/** "METHOD path name" -> the only values published for that parameter */
export type PublicParams = Record<string, string[]>;
/** schema name (as published) -> property names that may be published */
export type PublicFields = Record<string, string[]>;

const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace"];

const pascal = (s: string) => s.replace(/[^A-Za-z0-9]+/g, " ").trim().split(" ").map((w) => w[0].toUpperCase() + w.slice(1)).join("");

/** Published name for a raw schema name: drops module prefixes, and names generated body schemas after their operation. */
function publishedName(raw: string, summaryByRef: Map<string, string>): string {
  if (raw.includes("__")) return raw.slice(raw.lastIndexOf("__") + 2);
  if (raw.startsWith("Body_")) return `${pascal(summaryByRef.get(raw) ?? raw.slice(5))}Request`;
  return raw;
}

function clean(node: Json, rename: (n: string) => string): Json {
  if (Array.isArray(node)) return node.map((n) => clean(n, rename));
  if (node && typeof node === "object") {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("x-") || k === "description" || k === "example" || k === "examples") continue;
      if (k === "$ref" && typeof v === "string") { out[k] = v.replace(/[^/]+$/, rename); continue; }
      out[k] = clean(v, rename);
    }
    return out;
  }
  return node;
}

function collectRefs(node: Json, into: Set<string>): void {
  if (Array.isArray(node)) return node.forEach((n) => collectRefs(n, into));
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "$ref" && typeof v === "string") {
        const m = v.match(/^#\/components\/schemas\/(.+)$/);
        if (m) into.add(m[1]);
      } else collectRefs(v, into);
    }
  }
}

/** Parameter constraints (pattern, enum) can spell out internal values; drop them everywhere. */
function stripConstraints(node: Json): Json {
  if (Array.isArray(node)) return node.map(stripConstraints);
  if (node && typeof node === "object") {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(node)) if (k !== "pattern" && k !== "enum" && k !== "const") out[k] = stripConstraints(v);
    return out;
  }
  return node;
}

/** Keep only allowlisted properties. A schema with no entry publishes no properties. */
function onlyPublicFields(name: string, schema: Json, fields: PublicFields): Json {
  if (!schema || typeof schema !== "object" || !schema.properties) return schema;
  const ok = new Set(fields[name] ?? []);
  const properties: Record<string, Json> = {};
  for (const [k, v] of Object.entries(schema.properties)) if (ok.has(k)) properties[k] = v;
  const out = { ...schema, properties };
  if (Array.isArray(schema.required)) out.required = schema.required.filter((r: string) => ok.has(r));
  return out;
}

export function filterSpec(spec: OpenAPIObject, allow: string[], overrides: Overrides = {}, fields: PublicFields = {}, params: PublicParams = {}): OpenAPIObject {
  const wanted = new Set(allow.map((a) => a.trim().replace(/\s+/g, " ")));
  const rawPaths: Record<string, Json> = {};
  const summaryByRef = new Map<string, string>();
  for (const [path, item] of Object.entries<Json>(spec.paths ?? {})) {
    const kept: Record<string, Json> = {};
    for (const m of METHODS) {
      if (!item[m] || !wanted.has(`${m.toUpperCase()} ${path}`)) continue;
      const { operationId, tags, description, summary, responses, ...rest } = item[m];
      const ov = overrides[`${m.toUpperCase()} ${path}`];
      const op: Record<string, Json> = { summary: ov ? ov[0] : summary };
      Object.assign(op, rest);
      const rs: Record<string, Json> = {};
      for (const [code, r] of Object.entries<Json>(responses ?? {})) if (code !== "422") rs[code] = r;
      op.responses = rs;
      const curate = (q: Json) => {
        if (!q?.schema) return q;
        const schema = stripConstraints(q.schema);
        const values = params[`${m.toUpperCase()} ${path} ${q.name}`];
        if (values) schema.enum = values;
        return { ...q, schema };
      };
      if (op.parameters) op.parameters = op.parameters.map(curate);
      const refs = new Set<string>();
      collectRefs(op.requestBody, refs);
      for (const r of refs) if (!summaryByRef.has(r)) summaryByRef.set(r, op.summary);
      kept[m] = op;
    }
    if (Object.keys(kept).length) {
      if (item.parameters) kept.parameters = item.parameters.map((q: Json) => (q?.schema ? { ...q, schema: stripConstraints(q.schema) } : q));
      rawPaths[path] = kept;
    }
  }

  // Reachable schemas, by raw name.
  const all: Record<string, Json> = spec.components?.schemas ?? {};
  const needed = new Set<string>();
  collectRefs(rawPaths, needed);
  const queue = [...needed];
  while (queue.length) {
    const name = queue.pop()!;
    const refs = new Set<string>();
    collectRefs(onlyPublicFields(publishedName(name, summaryByRef), all[name], fields), refs);
    for (const r of refs) if (!needed.has(r)) { needed.add(r); queue.push(r); }
  }
  const rename = (n: string) => publishedName(n, summaryByRef);
  const schemas: Record<string, Json> = {};
  for (const name of Object.keys(all).sort()) {
    if (!needed.has(name)) continue;
    const pub = rename(name);
    schemas[pub] = clean(onlyPublicFields(pub, all[name], fields), rename);
  }

  const components: Record<string, Json> = {};
  if (Object.keys(schemas).length) components.schemas = schemas;
  if (spec.components?.securitySchemes) components.securitySchemes = clean(spec.components.securitySchemes, rename);

  const paths = clean(rawPaths, rename);
  // Operation prose is only ever the hand-written text; clean() strips every other description.
  for (const [path, item] of Object.entries<Json>(paths))
    for (const m of METHODS) {
      const ov = overrides[`${m.toUpperCase()} ${path}`];
      if (item[m] && ov) item[m].description = ov[1];
    }

  const info = { title: "Scenery HTTP API", version: spec.info?.version ?? "1" };
  return { openapi: spec.openapi, info, servers: [{ url: PUBLIC_SERVER }], paths, components };
}

export function loadAllow(): string[] {
  return JSON.parse(readFileSync(ROUTES_PATH, "utf8"));
}
export function loadOverrides(): Overrides {
  return JSON.parse(readFileSync(DESCRIPTIONS_PATH, "utf8"));
}
export function loadParams(): PublicParams {
  return JSON.parse(readFileSync(PARAMS_PATH, "utf8"));
}
export function loadFields(): PublicFields {
  return JSON.parse(readFileSync(FIELDS_PATH, "utf8"));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const raw = process.argv[2];
  if (!raw) throw new Error("usage: tsx scripts/filter-openapi.ts /path/to/raw/openapi.json");
  const spec = JSON.parse(readFileSync(raw, "utf8"));
  const allow = loadAllow();
  const out = filterSpec(spec, allow, loadOverrides(), loadFields(), loadParams());
  const found = new Set<string>();
  for (const [p, i] of Object.entries<Json>(out.paths)) for (const m of METHODS) if (i[m]) found.add(`${m.toUpperCase()} ${p}`);
  const missing = allow.filter((a) => !found.has(a));
  if (missing.length) throw new Error(`allowlisted routes missing from spec:\n${missing.join("\n")}`);
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`wrote ${SNAPSHOT_PATH} (${found.size} operations, ${Object.keys(out.components.schemas ?? {}).length} schemas)`);
}

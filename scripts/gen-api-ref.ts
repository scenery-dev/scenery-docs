/**
 * Renders src/content/docs/reference/api.md from the filtered snapshot
 * api/openapi.public.json. Run at build time (see package.json "build").
 * The snapshot is passed through filterSpec again as a safety net.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SNAPSHOT_PATH, filterSpec, loadAllow, loadFields, loadParams, loadOverrides, type OpenAPIObject } from "./filter-openapi";

const here = dirname(fileURLToPath(import.meta.url));
export const OUT_PATH = join(here, "..", "src", "content", "docs", "reference", "api.md");

type Json = any;
const METHODS = ["get", "post", "put", "patch", "delete"];

const GROUPS: { title: string; blurb: string; match: (p: string) => boolean }[] = [
  { title: "Skills", blurb: "Search, inspect, validate and publish skills.", match: (p) => /^\/(skills|portal\/skills|portal\/import)/.test(p) },
  { title: "Your installs", blurb: "Install and remove skills, MCP servers and plugins on your devices.", match: (p) => /^\/(installations|mcp-installations|plugin-installations)/.test(p) },
  { title: "Admin: users and devices", blurb: "Organization admin endpoints for people and devices, including the per-user and per-device kill switches.", match: (p) => /^\/admin\/(users|devices|installations)/.test(p) },
  { title: "Admin: audit", blurb: "Audit trails for export and review.", match: (p) => /^\/admin\/(audit-log|mcp\/audit|runner-audit)/.test(p) },
  { title: "Admin: catalog and revocation", blurb: "Manage skills, MCP servers and plugins, and revoke them everywhere.", match: (p) => /^\/admin\/(skills|mcp\/servers|plugins)/.test(p) },
];

const STATUS: Record<string, string> = { "200": "Success.", "201": "Created.", "202": "Accepted.", "204": "No content.", "400": "Bad request.", "401": "Not signed in.", "403": "Not allowed.", "404": "Not found.", "409": "Conflict." };

const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

function refName(r: string): string { return r.split("/").pop()!; }

function typeOf(s: Json): string {
  if (!s) return "";
  if (s.$ref) return `[${refName(s.$ref)}](#${refName(s.$ref).toLowerCase()})`;
  if (s.anyOf || s.oneOf) return (s.anyOf ?? s.oneOf).map(typeOf).filter((t: string) => t !== "null").join(" or ") || "null";
  if (s.enum) return s.enum.map((e: Json) => `\`${e}\``).join(", ");
  if (s.type === "array") return `array of ${typeOf(s.items) || "any"}`;
  const base = Array.isArray(s.type) ? s.type.filter((t: string) => t !== "null").join(" or ") : s.type;
  return `${base ?? "object"}${s.format ? ` (${s.format})` : ""}`;
}

function props(schema: Json): string[] {
  if (!schema?.properties) return [];
  const req = new Set<string>(schema.required ?? []);
  const rows = ["| Field | Type | Required |", "| --- | --- | --- |"];
  for (const [k, v] of Object.entries<Json>(schema.properties))
    rows.push(`| \`${k}\` | ${esc(typeOf(v))} | ${req.has(k) ? "yes" : "no"} |`);
  return rows;
}

function bodySchema(content: Json): Json | undefined {
  const j = content?.["application/json"] ?? Object.values<Json>(content ?? {})[0];
  return j?.schema;
}

export function renderApi(spec: OpenAPIObject): string {
  const base = spec.servers[0].url;
  const out: string[] = [
    "---",
    'title: "HTTP API reference"',
    'description: "The public HTTP API for scripting and integrating with Scenery."',
    "sidebar:",
    "  order: 3",
    "---",
    "",
    `This is the public subset of the Scenery HTTP API, version ${spec.info.version}. The base URL is \`${base}\`. Endpoints not listed here are internal and can change without notice.`,
    "",
    "Send a Bearer token in the `Authorization` header. Endpoints under `/admin` need an organization admin session. All other endpoints use the signed-in user's token.",
    "",
  ];
  const ops: { m: string; p: string; o: Json; item: Json }[] = [];
  for (const [p, item] of Object.entries<Json>(spec.paths))
    for (const m of METHODS) if (item[m]) ops.push({ m, p, o: item[m], item });
  const used = new Set<number>();
  GROUPS.forEach((g, gi) => {
    const list = ops.filter((x, i) => !used.has(i) && g.match(x.p));
    ops.forEach((x, i) => { if (g.match(x.p)) used.add(i); });
    if (!list.length) return;
    out.push(`## ${g.title}`, "", g.blurb, "");
    for (const { m, p, o, item } of list) {
      out.push(`### ${o.summary}`, "", `\`${m.toUpperCase()} ${p}\``, "");
      if (o.description) out.push(o.description, "");
      const params = [...(item.parameters ?? []), ...(o.parameters ?? [])];
      if (params.length) {
        out.push("| Parameter | In | Type | Required |", "| --- | --- | --- | --- |");
        for (const q of params)
          out.push(`| \`${q.name}\` | ${q.in} | ${esc(typeOf(q.schema))} | ${q.required ? "yes" : "no"} |`);
        out.push("");
      }
      if (o.requestBody) {
        const s = bodySchema(o.requestBody.content);
        const ct = Object.keys(o.requestBody.content ?? {})[0] ?? "";
        out.push(`**Request body** (\`${ct}\`): ${typeOf(s)}`, "");
      }
      out.push("**Responses**", "");
      for (const [code, r] of Object.entries<Json>(o.responses)) {
        const s = bodySchema(r.content);
        out.push(`- \`${code}\`: ${STATUS[code] ?? "Response."}${s ? ` Returns ${typeOf(s)}.` : ""}`);
      }
      out.push("");
    }
  });
  const schemas = spec.components?.schemas ?? {};
  if (Object.keys(schemas).length) {
    out.push("## Objects", "", "Request and response objects referenced above.", "");
    for (const [name, s] of Object.entries<Json>(schemas)) {
      out.push(`### ${name}`, "");
      const rows = props(s);
      if (rows.length) out.push(...rows, "");
      else if (s.enum) out.push(`One of: ${s.enum.map((e: Json) => `\`${e}\``).join(", ")}.`, "");
      else out.push(`Type: ${typeOf(s)}.`, "");
    }
  }
  return out.join("\n").trimEnd() + "\n";
}

export function loadSpec(): OpenAPIObject {
  const snap = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8"));
  return filterSpec(snap, loadAllow(), loadOverrides(), loadFields(), loadParams());
}

export function generate(): void {
  writeFileSync(OUT_PATH, renderApi(loadSpec()));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  generate();
  console.log(`wrote ${OUT_PATH}`);
}

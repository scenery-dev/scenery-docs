import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface GuardConfig {
  errorPatterns: string[];
  ipv4Exclude?: string[];
  warnPatterns: string[];
  allowHosts: string[];
  /** Error patterns that the host allowlist can never suppress. */
  privatePatterns: string[];
}
export interface Hit { file: string; line: number; pattern: string; level: "error" | "warn" }
export interface Ignored { file: string; line: number; reason: string }

const TEXT_EXT = new Set([".md", ".mdx", ".json", ".yaml", ".yml", ".txt", ".html", ".astro", ".ts", ".js", ".mjs"]);
const IGNORE_RE = /<!--\s*guard-ignore:\s*(.*?)\s*-->/;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function walk(p: string, out: string[]) {
  if (!existsSync(p)) return;
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const e of readdirSync(p)) walk(join(p, e), out);
  } else if (TEXT_EXT.has(extname(p))) out.push(p);
}

export function runGuardDetailed(paths: string[], config: GuardConfig): { hits: Hit[]; ignored: Ignored[] } {
  const files: string[] = [];
  for (const p of paths) walk(p, files);
  const allow = config.allowHosts.map((h) => new RegExp(`(?<![\\w.-])${esc(h)}(?![\\w-]|\\.[\\w-])`, "gi"));
  const errors = config.errorPatterns.map((p) => ({ p, re: new RegExp(p, "gi") }));
  const priv = (config.privatePatterns ?? []).map((p) => ({ p, re: new RegExp(p, "i") }));
  const isW = (c: string) => /[A-Za-z0-9_]/.test(c);
  const warns = config.warnPatterns.map((p) => ({
    p,
    re: new RegExp(`${isW(p[0]) ? "(?<![A-Za-z0-9_])" : ""}${esc(p)}${isW(p[p.length - 1]) ? "(?![A-Za-z0-9_])" : ""}`, "i"),
  }));
  const excl = new Set(config.ipv4Exclude ?? []);
  const hits: Hit[] = [];
  const ignored: Ignored[] = [];
  for (const file of files) {
    readFileSync(file, "utf8").split(/\r?\n/).forEach((text, i) => {
      const line = i + 1;
      const ig = IGNORE_RE.exec(text);
      if (ig) { ignored.push({ file, line, reason: ig[1] }); return; }
      let stripped = text;
      for (const a of allow) stripped = stripped.replace(a, " ");
      for (const { p, re } of priv) if (re.test(text)) hits.push({ file, line, pattern: p, level: "error" });
      for (const { p, re } of errors) {
        const m = [...stripped.matchAll(re)].filter((x) => !excl.has(x[0]));
        if (m.length) hits.push({ file, line, pattern: p, level: "error" });
      }
      for (const { p, re } of warns) if (re.test(text)) hits.push({ file, line, pattern: p, level: "warn" });
    });
  }
  return { hits, ignored };
}

export function runGuard(paths: string[], config: GuardConfig): Hit[] {
  return runGuardDetailed(paths, config).hits;
}

const here = dirname(fileURLToPath(import.meta.url));

export function loadConfig(): GuardConfig {
  const config = JSON.parse(readFileSync(join(here, "content-guard.config.json"), "utf8")) as GuardConfig;
  const extra: string[] = [];
  const env = process.env.GUARD_PRIVATE_PATTERNS;
  if (env) extra.push(...env.split("\n"));
  const pf = join(here, "content-guard.private.json");
  if (existsSync(pf)) {
    const j = JSON.parse(readFileSync(pf, "utf8"));
    extra.push(...(Array.isArray(j) ? j : j.privatePatterns ?? []));
  }
  config.privatePatterns = [...(config.privatePatterns ?? []), ...extra.map((s) => s.trim()).filter(Boolean)];
  return config;
}

function main() {
  const root = join(here, "..");
  const targets = [join(root, "src/content")];
  const dist = join(root, "dist");
  if (existsSync(dist)) targets.push(dist);
  const { hits, ignored } = runGuardDetailed(targets, loadConfig());
  // dist is limited to markdown outputs
  const rel = (f: string) => f.replace(root + "/", "");
  const keep = (f: string) => !f.startsWith(dist) || f.endsWith(".md");
  const H = hits.filter((h) => keep(h.file));
  const errors = H.filter((h) => h.level === "error");
  const warns = H.filter((h) => h.level === "warn");
  for (const h of errors) console.error(`ERROR ${rel(h.file)}:${h.line} ${h.pattern}`);
  if (warns.length) {
    console.log("Owner-review list (mechanism words):");
    for (const h of warns) console.log(`  WARN ${rel(h.file)}:${h.line} ${h.pattern}`);
  }
  for (const i of ignored.filter((x) => keep(x.file))) console.log(`  IGNORED ${rel(i.file)}:${i.line} ${i.reason}`);
  console.log(`guard: ${errors.length} error(s), ${warns.length} warning(s), ${ignored.length} ignored`);
  process.exit(errors.length ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();

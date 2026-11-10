// Post-build: copy each source page's Markdown body to dist/<slug>.md
// (frontmatter replaced by a title heading, MDX imports/components stripped).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, appendFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src", "content", "docs");
const dist = join(root, "dist");

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

export function toMarkdown(raw: string): string {
  let title = "";
  let body = raw;
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fm) {
    body = raw.slice(fm[0].length);
    const t = fm[1].match(/^title:\s*(.+)$/m);
    if (t) title = t[1].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
  const lines: string[] = [];
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (!fence) {
      if (/^\s*(import|export)\s.+from\s+['"].+['"];?\s*$/.test(line)) continue;
      // self-closing or single-line JSX component tags, e.g. <Card ... />
      if (/^\s*<\/?[A-Z][\w.]*(\s[^>]*)?\/?>\s*$/.test(line)) continue;
    }
    lines.push(line);
  }
  const text = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return (title ? `# ${title}\n\n` : "") + text + "\n";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let n = 0;
  const entries: string[] = [];
  for (const f of walk(src)) {
    if (!/\.mdx?$/.test(f)) continue;
    const slug = relative(src, f).replace(/\.mdx?$/, "").replace(/(^|\/)index$/, "");
    if (slug === "") continue;
    const out = join(dist, `${slug}.md`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, toMarkdown(readFileSync(f, "utf8")));
    n++;
    const t = toMarkdown(readFileSync(f, "utf8")).match(/^# (.+)$/m);
    entries.push(`- [${t ? t[1] : slug}](https://docs.scenery.dev/${slug}/): Markdown at https://docs.scenery.dev/${slug}.md`);
  }
  // starlight-llms-txt only links its two bundles; list every page too.
  entries.sort();
  appendFileSync(join(dist, "llms.txt"), `\n## Pages\n\n${entries.join("\n")}\n`);
  console.log(`emit-md: wrote ${n} markdown files`);
}

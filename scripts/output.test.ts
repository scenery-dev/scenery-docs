import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = join(__dirname, "..", "dist");

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const pages = () =>
  walk(dist).filter((f) => f.endsWith("index.html") && !relative(dist, f).startsWith("404"));

describe("machine-readable output (run `npm run build` first)", () => {
  it("emits llms.txt listing every page URL", () => {
    const f = join(dist, "llms.txt");
    expect(existsSync(f)).toBe(true);
    const txt = readFileSync(f, "utf8");
    for (const p of pages()) {
      const rel = relative(dist, p).replace(/index\.html$/, "");
      if (rel === "") continue; // home page is the llms.txt header itself
      expect(txt, rel).toContain(`https://docs.scenery.dev/${rel}`);
    }
  });

  it("emits a sibling .md for every index.html", () => {
    const missing: string[] = [];
    for (const p of pages()) {
      const rel = relative(dist, p).replace(/\/?index\.html$/, "");
      if (rel === "") continue;
      if (!existsSync(join(dist, `${rel}.md`))) missing.push(rel);
    }
    expect(missing).toEqual([]);
  });

  it("emits llms-full.txt", () => {
    expect(existsSync(join(dist, "llms-full.txt"))).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { OUT_PATH, loadSnapshot, renderChangelog } from "./gen-changelog";
import { loadConfig, runGuard } from "./content-guard";

describe("gen-changelog", () => {
  const snap = loadSnapshot();
  const out = renderChangelog(snap);

  it("includes v2.2.1", () => {
    expect(out).toContain("v2.2.1");
  });
  it("renders every release (all curated) and the committed page is current", () => {
    for (const r of snap.releases) expect(r.items.length).toBeGreaterThan(0);
    expect(readFileSync(OUT_PATH, "utf8")).toBe(out);
  });
  it("never renders raw release notes", () => {
    expect(out).not.toContain("Full Changelog");
  });
  it("passes the content guard", () => {
    const dir = mkdtempSync(join(tmpdir(), "changelog-"));
    try {
      const f = join(dir, "changelog.md");
      writeFileSync(f, out);
      expect(runGuard([f], loadConfig()).filter((h) => h.level === "error")).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

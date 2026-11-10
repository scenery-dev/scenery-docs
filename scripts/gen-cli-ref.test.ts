import { describe, it, expect } from "vitest";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { INCLUDE, OUT_PATH, loadSnapshot, renderCli } from "./gen-cli-ref";
import { loadConfig, runGuard } from "./content-guard";

describe("gen-cli-ref", () => {
  const snap = loadSnapshot();
  const out = renderCli(snap);

  it("documents scenery auth pair", () => {
    expect(out).toContain("scenery auth pair");
  });
  it("leaves out daemon run and mcp serve", () => {
    expect(out).not.toContain("daemon run");
    expect(out).not.toContain("mcp serve");
  });
  it("is rendered from the 2.2.1 snapshot and the committed page is current", () => {
    expect(snap.version).toBe("2.2.1");
    expect(readFileSync(OUT_PATH, "utf8")).toBe(out);
  });
  it("covers every included command", () => {
    for (const g of INCLUDE) for (const c of g.commands) expect(out).toContain(`scenery ${c}`);
  });
  it("passes the content guard", () => {
    const dir = mkdtempSync(join(tmpdir(), "cli-ref-"));
    try {
      const f = join(dir, "cli.md");
      writeFileSync(f, out);
      expect(runGuard([f], loadConfig()).filter((h) => h.level === "error")).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

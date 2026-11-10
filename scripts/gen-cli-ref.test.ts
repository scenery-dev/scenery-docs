import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { INCLUDE, OUT_PATH, SNAPSHOT_PATH, renderCli, generate, type Snapshot } from "./gen-cli-ref";

describe("gen-cli-ref", () => {
  generate();
  const out = readFileSync(OUT_PATH, "utf8");
  const snap = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8")) as Snapshot;

  it("documents scenery auth pair", () => {
    expect(out).toContain("scenery auth pair");
  });
  it("leaves out daemon run and mcp serve", () => {
    expect(out).not.toContain("daemon run");
    expect(out).not.toContain("mcp serve");
  });
  it("is rendered from the 2.2.1 snapshot", () => {
    expect(snap.version).toBe("2.2.1");
    expect(renderCli(snap)).toBe(out);
  });
  it("covers every included command", () => {
    for (const g of INCLUDE) for (const c of g.commands) expect(out).toContain(`scenery ${c}`);
  });
  it("carries no internal wording", () => {
    for (const bad of ["REDACTED", "vectorhawk", "REDACTED", "REDACTED", "keychain", "reconciler", "/Users/", "/home/"])
      expect(out).not.toContain(bad);
  });
});

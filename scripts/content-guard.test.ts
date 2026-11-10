import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGuard, runGuardDetailed, formatHit, type GuardConfig } from "./content-guard";

// Fake internal names, injected as "private" patterns. The real ones live
// only in a gitignored file / env var, never in this repo.
const config: GuardConfig = {
  errorPatterns: [
    "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
    "\\bi-[0-9a-f]{8,17}\\b",
    "\\.pem\\b",
    "/home/[a-z]+",
    "/Users/[a-z]+",
    "[a-z0-9-]+\\.vectorhawk\\.ai",
  ],
  ipv4Exclude: ["127.0.0.1", "0.0.0.0"],
  warnPatterns: ["keychain", "secrets/", "0600", "0700", "minisign", "ed25519", "kid", "trusted_keys", "encrypt", "vault"],
  allowHosts: ["scenery.dev", "app.scenery.dev", "install.scenery.dev", "docs.scenery.dev"],
  privatePatterns: ["internalbox", "staging\\.example-internal\\.test"],
};

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "guard-")); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

function hitsFor(text: string) {
  const f = join(dir, "a.md");
  writeFileSync(f, text);
  return runGuard([f], config);
}

describe("content guard", () => {
  it("flags internal hostnames", () => {
    const h = hitsFor("see staging.example-internal.test\nand internalbox\n");
    expect(h.filter((x) => x.level === "error")).toHaveLength(2);
    expect(h[0].line).toBe(1);
  });
  it("flags ipv4 except loopback", () => {
    expect(hitsFor("host 203.0.113.7")).toHaveLength(1);
    expect(hitsFor("host 127.0.0.1")).toHaveLength(0);
  });
  it("flags instance ids", () => {
    expect(hitsFor("i-0123456789abcdef0")).toHaveLength(1);
  });
  it("flags security mechanisms at warn level", () => {
    for (const w of ["0600", "secrets/", "keychain fallback", "minisign"]) {
      const h = hitsFor(`uses ${w} here`);
      expect(h.length, w).toBeGreaterThanOrEqual(1);
      expect(h.every((x) => x.level === "warn")).toBe(true);
    }
  });
  it("mechanism words match on word boundaries", () => {
    expect(hitsFor("the kids are fine")).toHaveLength(0);
    expect(hitsFor("the KID header")).toHaveLength(1);
  });
  it("matches secrets/ followed by a path", () => {
    const h = hitsFor("a secrets/foo here");
    expect(h).toHaveLength(1);
    expect(h[0].level).toBe("warn");
  });
  it("allowlist does not hide a vectorhawk subdomain suffix", () => {
    const h = hitsFor("app.scenery.dev.vectorhawk.ai");
    expect(h.filter((x) => x.level === "error")).toHaveLength(1);
  });
  it("allowlisted public hosts pass", () => {
    expect(hitsFor("app.scenery.dev install.scenery.dev scenery.dev docs.scenery.dev")).toHaveLength(0);
  });
  it("allowlist does not suppress private patterns", () => {
    const c = { ...config, privatePatterns: ["dev\\.scenery\\.test"] };
    const f = join(dir, "b.md");
    writeFileSync(f, "app.scenery.dev and dev.scenery.test");
    expect(runGuard([f], c)).toHaveLength(1);
  });
  it("inline ignore skips the line and is reported", () => {
    const f = join(dir, "c.md");
    writeFileSync(f, "internalbox <!-- guard-ignore: example -->\n");
    const r = runGuardDetailed([f], config);
    expect(r.hits).toHaveLength(0);
    expect(r.ignored).toEqual([{ file: f, line: 1, reason: "example" }]);
  });
  it("walks directories and reports file:line", () => {
    writeFileSync(join(dir, "d.mdx"), "ok\n/home/bob/x\n");
    const h = runGuard([dir], config);
    expect(h).toHaveLength(1);
    expect(h[0]).toMatchObject({ line: 2, level: "error" });
  });
  it("formatHit never prints a private pattern", () => {
    const h = hitsFor("see internalbox").filter((x) => x.level === "error");
    expect(h).toHaveLength(1);
    const out = formatHit(h[0]);
    expect(out).toContain("private pattern #1");
    expect(out).not.toContain("internalbox");
  });
  it("formatHit prints public patterns as before", () => {
    const h = hitsFor("host 203.0.113.7");
    expect(formatHit(h[0])).toContain(h[0].pattern);
  });
  it("invalid private regex error does not leak the source", () => {
    const c = { ...config, privatePatterns: ["internalbox(["] };
    const f = join(dir, "e.md");
    writeFileSync(f, "x");
    expect(() => runGuard([f], c)).toThrow("invalid private pattern #1");
    try { runGuard([f], c); } catch (e) { expect(String(e)).not.toContain("internalbox"); }
  });
});

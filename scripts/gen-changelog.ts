/**
 * Generates src/content/docs/reference/changelog.md from a checked-in snapshot,
 * so the docs build never needs `gh`.
 *
 * Render (default):      npx tsx scripts/gen-changelog.ts
 * Refresh the raw data:  npx tsx scripts/gen-changelog.ts --refresh
 *   Runs `gh release list` / `gh release view --repo scenery-dev/scenery` and
 *   adds any NEW stable release to the snapshot with an empty `items` list and
 *   the raw GitHub notes in `raw` (never rendered). Existing entries are kept.
 *   Then write `items` BY HAND: user-facing changes only. Release notes can
 *   hold internal detail (hosts, milestone codes, how a bug worked); drop
 *   anything that describes a vulnerability's mechanism. Entries with empty
 *   `items` are not rendered, and the test fails until they are curated.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const SNAPSHOT_PATH = join(here, "changelog.snapshot.json");
export const OUT_PATH = join(here, "..", "src", "content", "docs", "reference", "changelog.md");

export interface Release {
  tag: string;
  date: string;
  items: string[];
  raw?: string;
}
export interface ChangelogSnapshot {
  repo: string;
  releases: Release[];
}

export function loadSnapshot(): ChangelogSnapshot {
  return JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8")) as ChangelogSnapshot;
}

export function renderChangelog(snap: ChangelogSnapshot): string {
  const parts: string[] = [
    "---",
    'title: "Changelog"',
    'description: "Runner releases."',
    "sidebar:",
    "  order: 4",
    "---",
    "",
    `User-facing changes in each release of the Scenery runner. Upgrade with \`brew upgrade scenery\` or see [Install the runner](/rollout/install-the-runner/). Releases are published at [github.com/${snap.repo}/releases](https://github.com/${snap.repo}/releases).`,
    "",
  ];
  for (const r of snap.releases) {
    if (r.items.length === 0) continue;
    parts.push(`## ${r.tag} (${r.date})`, "", ...r.items.map((i) => `- ${i}`), "");
  }
  return parts.join("\n").trimEnd() + "\n";
}

export function refresh(): void {
  const snap = loadSnapshot();
  const gh = (args: string[]) => execFileSync("gh", args, { encoding: "utf8" });
  const list = JSON.parse(
    gh(["release", "list", "--repo", snap.repo, "--limit", "100", "--json", "tagName,isPrerelease,publishedAt"]),
  ) as { tagName: string; isPrerelease: boolean; publishedAt: string }[];
  const have = new Set(snap.releases.map((r) => r.tag));
  const fresh: Release[] = [];
  for (const l of list) {
    if (l.isPrerelease || have.has(l.tagName) || !l.tagName.startsWith("v2.")) continue;
    const raw = gh(["release", "view", l.tagName, "--repo", snap.repo, "--json", "body", "-q", ".body"]).trim();
    fresh.push({ tag: l.tagName, date: l.publishedAt.slice(0, 10), items: [], raw });
  }
  snap.releases = [...fresh, ...snap.releases];
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(snap, null, 2) + "\n");
  console.log(`added ${fresh.length} release(s) to the snapshot; curate their items`);
}

export function generate(): void {
  writeFileSync(OUT_PATH, renderChangelog(loadSnapshot()));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes("--refresh")) refresh();
  else {
    generate();
    console.log(`wrote ${OUT_PATH}`);
  }
}

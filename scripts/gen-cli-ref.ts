/**
 * Generates src/content/docs/reference/cli.md from a checked-in snapshot of
 * `scenery <cmd> --help` output. The docs build never needs the binary.
 *
 * Render (default):      npx tsx scripts/gen-cli-ref.ts
 * Regenerate snapshot:   npx tsx scripts/gen-cli-ref.ts --snapshot /path/to/scenery
 *   (point it at a downloaded release binary, e.g. from
 *    `gh release download vX.Y.Z --repo scenery-dev/scenery`; it only runs
 *    `--help` and `-V`, never any other command.) This captures RAW help text.
 *   Then edit scripts/cli-help.snapshot.json BY HAND for public wording (no
 *   internal names, paths or mechanisms); the snapshot is hand-curated and
 *   the test runs the content guard over the rendered page. Then re-render.
 *
 * Only commands in INCLUDE are documented. Daemon foreground runs, the MCP
 * relay shim, and debug/internal commands are deliberately left out.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const SNAPSHOT_PATH = join(here, "cli-help.snapshot.json");
export const OUT_PATH = join(here, "..", "src", "content", "docs", "reference", "cli.md");

export interface Group {
  title: string;
  blurb: string;
  commands: string[];
}

/** Explicit include-list: commands an admin or employee runs. */
export const INCLUDE: Group[] = [
  { title: "Health", blurb: "Check that this device is set up correctly.", commands: ["doctor"] },
  {
    title: "Authentication",
    blurb: "Sign in, pair a device, or use a token for headless machines.",
    commands: ["auth login", "auth logout", "auth status", "auth token", "auth pair"],
  },
  {
    title: "AI client integration",
    blurb: "Connect Scenery to Claude Code and trigger a sync.",
    commands: ["mcp setup", "mcp remove", "mcp sync", "mcp backends"],
  },
  {
    title: "Skills",
    blurb: "Find, install, author and publish skills.",
    commands: [
      "skill list", "skill search", "skill install", "skill info", "skill update",
      "skill uninstall", "skill init", "skill author", "skill validate", "skill publish",
    ],
  },
  {
    title: "Plugins",
    blurb: "Install and remove governed plugins.",
    commands: ["plugin install", "plugin uninstall"],
  },
  {
    title: "Background service",
    blurb: "Install or restart the background service that keeps this device in sync.",
    commands: ["daemon install", "daemon restart"],
  },
  { title: "Removal", blurb: "Remove Scenery from this device.", commands: ["uninstall"] },
];

export interface Snapshot {
  version: string;
  commands: Record<string, string>;
}

export function captureSnapshot(binary: string): Snapshot {
  const run = (args: string[]) =>
    execFileSync(binary, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const version = run(["-V"]).trim().replace(/^scenery\s+/, "");
  const commands: Record<string, string> = {};
  for (const g of INCLUDE) for (const c of g.commands) commands[c] = run([...c.split(" "), "--help"]).replace(/[ \t]+$/gm, "").trimEnd();
  return { version, commands };
}

export function renderCli(snap: Snapshot): string {
  const parts: string[] = [
    "---",
    'title: "CLI reference"',
    'description: "Commands that admins and employees run."',
    "sidebar:",
    "  order: 1",
    "---",
    "",
    `This reference covers the \`scenery\` command-line tool, version ${snap.version}. The short alias \`scn\` works for every command. Run \`scenery <command> --help\` for the same text on your machine.`,
    "",
    "Pairing a device starts in the portal: open **My Devices**, choose **Add a new device**, and copy the code it shows. Then run `scenery auth pair <code>`. Parts of the help text below mention a setup screen on the catalog page; that wording is out of date.",
    "",
  ];
  for (const g of INCLUDE) {
    parts.push(`## ${g.title}`, "", g.blurb, "");
    for (const c of g.commands) {
      const help = snap.commands[c];
      if (!help) throw new Error(`snapshot missing command: ${c}`);
      parts.push(`### \`scenery ${c}\``, "", "```text", help, "```", "");
    }
  }
  return parts.join("\n").trimEnd() + "\n";
}

export function loadSnapshot(): Snapshot {
  return JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8")) as Snapshot;
}

export function generate(): void {
  writeFileSync(OUT_PATH, renderCli(loadSnapshot()));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const i = process.argv.indexOf("--snapshot");
  if (i > -1) {
    const snap = captureSnapshot(process.argv[i + 1]);
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(snap, null, 2) + "\n");
    console.log(`snapshot written for ${snap.version}`);
  } else {
    generate();
    console.log(`wrote ${OUT_PATH}`);
  }
}

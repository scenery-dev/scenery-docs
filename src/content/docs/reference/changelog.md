---
title: "Changelog"
description: "Runner releases."
sidebar:
  order: 4
---

User-facing changes in each release of the Scenery runner. Upgrade with `brew upgrade scenery` or see [Install the runner](/rollout/install-the-runner/). Releases are published at [github.com/scenery-dev/scenery/releases](https://github.com/scenery-dev/scenery/releases).

## v2.2.1 (2026-11-09)

- Installing a tool no longer asks the employee to approve it in a terminal.
- Local MCP servers install on click once their definition is verified.

## v2.2.0 (2026-11-09)

- Tool definitions, plugins and policy are verified before the runner acts on them. A revoked tool comes back only on a verified decision from your organization.
- The installer verifies the runner download before installing it.
- Stronger checks on downloaded tool files.
- Google Antigravity is governed alongside the other supported AI clients.
- The runner reconnects more gracefully when its connection to Scenery drops or a sign-in expires.

## v2.1.1 (2026-11-08)

- Uninstalling restores AI client settings without overwriting edits you made yourself.
- Setup keeps the formatting of your AI client settings and backs them up first.
- MCP servers that connect over streamable HTTP work correctly.
- The runner reports its version to Scenery, so older runners can be prompted to upgrade.
- Fixed skill details, the MCP catalog and skill search for signed-in users.

## v2.0.2 (2026-11-03)

- Revocation is more reliable, including for adopted skills, plugins and MCP servers.
- Revoked tools are no longer reinstalled by first-run migration.
- Skill installs no longer skip an update when the target version differs.

## v2.0.1 (2026-11-03)

- Revocation always completes its cleanup, and is not re-applied when the same update arrives twice.
- Removing a plugin no longer rewrites your own settings files.
- Skill installs wait for the skill's files before reporting success.
- The installer no longer errors when run without a terminal.

## v2.0.0 (2026-10-29)

- The product is now Scenery. The command is `scenery`, with `scn` as a short alias.
- This was a clean break. Runners before 2.0.0 do not work with the current control plane.

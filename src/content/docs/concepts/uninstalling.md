---
title: "Uninstalling restores, not deletes"
description: "What happens to a laptop when a tool is removed."
sidebar:
  order: 10
---

## What it is

Removing Scenery from a laptop puts the machine back the way it was. Whatever the employee had before is still there, minus tools that came only from the organization.

## Why it exists

Nobody should fear that trying Scenery will break their setup. Uninstalling is meant to be safe, so it is part of the product and not an afterthought.

## What happens

`scenery uninstall` stops the background service and removes Scenery from AI client configs. It signs the device out of Scenery, removes the device from your organization (recorded in IT's audit log) and deletes its sign-in from the laptop. Add `--purge` to also delete the runner's other local data.

It then writes a restore report with three sections:

- **Removed.** Tools that only worked through Scenery, such as brokered MCP servers, are removed completely. The report lists their name, source and sign-in type so the employee can add them back on their own.
- **Kept.** Tools the employee brought themselves stay in place, no longer tracked by Scenery.
- **Restored.** Anything Scenery took over is put back from backup.

Use `--dry-run` to see the plan without changing anything. See the [CLI reference](/reference/cli/).

## Related

- [Adopting tools already on a laptop](/concepts/adopting-local-tools/)
- [Devices and pairing](/concepts/devices-and-pairing/)

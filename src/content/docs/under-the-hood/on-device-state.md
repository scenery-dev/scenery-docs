---
title: "On-device state"
description: "What the runner keeps on a laptop."
sidebar:
  order: 3
---

The runner keeps a small amount of information on each laptop so it can work between syncs and when offline.

## What it keeps

- **Installed tools.** What is installed on this device and where it came from.
- **Sync status.** What the runner last learned from the control plane, so it can carry on when the laptop is offline.
- **An activity buffer.** Events waiting to be reported to the audit trail. They are sent when the laptop is online.

The runner's sign-in to Scenery is kept separate from the rest of its data.

## What it does not keep

The runner does not keep the credentials for connected services through Scenery. See [Brokered sign-in to tools](/concepts/brokered-sign-in/).

## Removing it

`scenery uninstall` restores AI client settings, signs the device out of Scenery, removes it from your organization (recorded in IT's audit log) and deletes its sign-in from the laptop. Add `--purge` to also delete the runner's other local data. See [Uninstalling restores, not deletes](/concepts/uninstalling/).

## Related

- [Daemon and shim](/under-the-hood/daemon-and-shim/)

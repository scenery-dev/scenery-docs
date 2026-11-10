---
title: "Daemon and shim"
description: "The two processes that make up the runner."
sidebar:
  order: 1
---

The runner is one program, `scenery`, that plays two roles on a laptop. The runner is open source, so you can read how both work. See [Source code](/under-the-hood/source-code/).

## The daemon

A background service, started for the signed-in user by the operating system (a launch agent on macOS, a user service on Linux). It stays running and keeps the laptop in step with the control plane. Employees do not start it by hand. `scenery daemon install` sets it up and `scenery daemon restart` restarts it.

The daemon is what:

- Keeps your approved tools available to the AI client.
- Acts on revocations, such as removing a tool an admin has cut off.
- Keeps the laptop in sync with the organization's policy.
- Reports activity for the audit trail.

## The shim

A thin relay that an AI client starts when it connects. It passes messages between the client and the daemon. Because the daemon holds the state, many AI client windows can share one daemon, and a client restart does not lose anything.

## Checking on it

Run `scenery doctor` to see whether the background service is running. See the [CLI](/reference/cli/) and [Troubleshooting](/rollout/troubleshooting/).

## Related

- [Sync and signing](/under-the-hood/sync-and-signing/)
- [Client setup](/under-the-hood/client-setup/)

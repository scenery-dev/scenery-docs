---
title: "Devices and pairing"
description: "How a laptop becomes a managed device."
sidebar:
  order: 8
---

## What it is

A device is a laptop or workstation running the Scenery runner. **Pairing** connects it to a signed-in user. Every device, new or existing, is paired, either with a pairing code or by signing in from the device.

## Why it exists

Pairing is how Scenery knows a device belongs to a real, signed-in person. A device that is not paired gets no tools.

## How it works

1. The employee installs the runner.
2. In the portal, they get a pairing code. The portal shows it under **My Devices** > **Add a new device** (the home page's **Pair a device** button takes them there).
3. They run `scenery auth pair <code>`.

A new computer can also join with `scenery auth login`, which signs in through the browser.

## Revoking a device

Revoking a device is permanent for that device record. There is no restore. The employee brings the machine back by running `scenery auth pair` again, which registers it as a **new device**.

## What an admin sees

**Devices** in the admin navigation lists devices and their status, such as active, offline or stale, and shows what is installed on each. A device's page has **Revoke Device**. Employees see their own on **My Devices**.

## Related

- [Pair devices](/rollout/pair-devices/)
- [Installs are per device, sign-ins are per user](/concepts/installs-and-sign-ins/)

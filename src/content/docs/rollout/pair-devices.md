---
title: "Pair devices"
description: "Connect each laptop to your organization."
sidebar:
  order: 3
---

Pairing connects an installed runner to a signed-in person. A device that is not paired gets no tools. See [Devices and pairing](/concepts/devices-and-pairing/) for the idea. Each employee pairs their own computer.

## Before you start

The employee has an account and has [installed the runner](/rollout/install-the-runner/).

## Pair a device (employee steps)

1. Sign in to the portal at [app.scenery.dev](https://app.scenery.dev).

   Expected: the portal home page opens. If the person has no device yet, a **Pair a device** button is shown.

2. Choose **Pair a device**, or open **My Devices** and expand **Add a new device**.

   Expected: a panel titled **Install the Scenery agent** shows the install commands and a pairing command that looks like `scenery auth pair <code>`, with a countdown. The panel says **Waiting for agent to connect**.

3. In a terminal on the laptop, run the pairing command exactly as shown.

   ```bash
   scenery auth pair <code>
   ```

   Expected: the terminal prints **Paired successfully.**

4. Go back to the portal.

   Expected: the panel closes and the laptop appears under **My Devices** with status **Active**. This usually takes a few seconds.

5. Restart Claude Code (or the AI client in use).

   Expected: the Scenery tools are available in the client.

If you ran `scenery auth pair` with no code, the command asks you to paste it.

## What a code is

A pairing code works once and expires after about 10 minutes. The portal shows a countdown. If it runs out, choose **Refresh code** to get a new one. Collapsing and reopening **Add a new device** also creates a new code.

## Confirm as an admin

1. In the admin portal, open **Devices** under **Activity**.

   Expected: a table with User, Hostname, Platform, Status, Agent Version, Last Seen and Installs. The new laptop is listed. Counts at the top show active, offline and stale devices.

2. Select the device row to see its details and what is installed on it.

   Expected: a panel with the hostname, registered date, last seen, and the list of tools on that device.

## Device status

| Status | Meaning |
|---|---|
| **Active** | The device checked in recently. |
| **Offline** | No check-in for about 5 minutes. Usually a closed laptop. |
| **Stale** | No check-in for more than 7 days. |
| **Needs re-auth** | The runner is running but the person's sign-in has expired. They run `scenery auth login`, then `scenery daemon restart`. |
| **Waiting for agent** | The device is registered but the runner has not started on it yet. |

An offline or stale device does not receive new installs or removals until it comes back.

## Other ways to sign in

`scenery auth login` signs in through the browser and also registers the computer. Pairing with a code is the path shown in the portal and works well on machines where a browser sign-in is awkward.

## Rename or remove a device

- Employees can rename a device with the pencil icon on **My Devices**.
- **Remove** on **My Devices** unregisters the device and clears its tool installs. A runner that is still running on that machine registers again by itself.
- Admins cut off a lost or retired device with **Revoke Device**. See [Revoke and kill switches](/rollout/revoke-and-kill-switches/).

## Related

- [Devices and pairing](/concepts/devices-and-pairing/)
- [Install the runner](/rollout/install-the-runner/)
- [Troubleshooting](/rollout/troubleshooting/)

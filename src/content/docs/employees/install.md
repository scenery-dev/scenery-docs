---
title: "Install"
description: "Install Scenery on your laptop."
sidebar:
  order: 1
---

Scenery is a small app that runs on your laptop. It puts the AI tools your company approved into Claude Code and other AI clients, so they just work. You install it once per computer.

Your IT team will usually send you an invite email first. Accept it and set your password before you start.

## Before you start

- A Mac (Apple silicon or Intel) or a Linux computer (x86_64).
- Your Scenery account, from your invite. You sign in at [app.scenery.dev](https://app.scenery.dev).
- On a Mac: [Homebrew](https://brew.sh). On Linux: a terminal with `curl`.

## Install on a Mac

1. Open a terminal and run:

   ```bash
   brew tap scenery-dev/tap && brew trust scenery-dev/tap && \
     brew install scenery && brew services start scenery
   ```

   Expected: Homebrew installs the `scenery` command (short alias `scn`) and starts Scenery in the background. It starts again by itself every time you log in.

2. Connect your AI clients:

   ```bash
   scenery mcp setup
   ```

   Expected: Scenery adds itself to the AI clients it finds on your computer, such as Claude Code. See [Connect your AI client](/employees/connect-your-ai-client/) for what to do next.

3. Check that it works:

   ```bash
   scenery doctor
   ```

   Expected: the output shows the Scenery version and a daemon status of running.

## Install on Linux

1. Run:

   ```bash
   curl -fsSL https://install.scenery.dev | sh
   ```

   Expected: the script downloads the latest release, verifies it, installs the `scenery` command, starts Scenery in the background and connects your AI clients.

2. If the script says it cannot verify the release, install a signature checker as the message suggests, or use Homebrew. Do not skip verification.

3. If the script asks for a pairing code, see the next section. To pair later, press Enter at each prompt until the script moves on. It then reports that pairing failed. You can ignore that message: the install still completes.

4. Open a new terminal and run `scenery doctor`.

   Expected: the daemon status shows running.

## Pair your laptop

Until you pair, your laptop gets no tools. Pairing links the laptop to your account.

1. Sign in at [app.scenery.dev](https://app.scenery.dev).

   Expected: the home page opens with a **Pair a device** button.

2. Choose **Pair a device**, then expand **Add a new device**.

   Expected: you see a command that looks like `scenery auth pair <code>`, with a countdown.

3. Run that command in a terminal on your laptop.

   Expected: the terminal prints **Paired successfully.** A few seconds later your laptop shows under **My Devices** with the status **Active**.

Codes work once and expire after about 10 minutes. If yours runs out, choose **Refresh code**. For the full details and device statuses, see [Pair devices](/rollout/pair-devices/).

## Keep it up to date

On a Mac, run `brew upgrade scenery` now and then. On Linux, run the install script again. If a tool shows **Waiting on this device**, an upgrade is the fix. See [Find and install tools](/employees/find-and-install-tools/).

## Remove Scenery

`scenery uninstall` puts your computer back the way it was. See [Uninstalling restores, not deletes](/concepts/uninstalling/).

## Next

- [Connect your AI client](/employees/connect-your-ai-client/)
- [Install the runner (admin guide)](/rollout/install-the-runner/)
- [Troubleshooting](/rollout/troubleshooting/)

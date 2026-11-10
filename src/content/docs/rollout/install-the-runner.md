---
title: "Install the runner"
description: "Install with Homebrew or the install script."
sidebar:
  order: 1
---

The runner is the Scenery app on each employee's laptop. It keeps approved tools available in Claude Code, Cursor and other AI clients, and carries out your revocations. Each employee installs it once per computer. For background, see [What is Scenery](/overview/what-is-scenery/).

You do not need to install it on your own admin machine. The admin portal runs in the browser.

## Before you start

- A supported computer: macOS (Apple silicon or Intel) or Linux (x86_64). Other platforms are not supported yet.
- The employee has been [invited](/rollout/invite-users/) and has an account.
- For Homebrew: Homebrew is installed. For the install script: `curl` and a terminal.

## Install on macOS with Homebrew

1. Open a terminal and run all four commands:

   ```bash
   brew tap scenery-dev/tap && brew trust scenery-dev/tap && \
     brew install scenery && brew services start scenery
   ```

   Expected: Homebrew installs the `scenery` command (with the short alias `scn`) and starts the background service. The service starts again automatically at every login.

2. Connect your AI clients:

   ```bash
   scenery mcp setup
   ```

   Expected: Scenery adds itself to the AI clients it finds on the computer, such as Claude Code. Restart the client afterwards so it picks up the change.

3. Check the result:

   ```bash
   scenery doctor
   ```

   Expected: the output shows the runner version, and the daemon status as running. The registry line shows whether the computer can reach Scenery.

## Install on Linux with the install script

1. Run:

   ```bash
   curl -fsSL https://install.scenery.dev | sh
   ```

   Expected: the script downloads the latest release, checks its signature and checksum, and installs the `scenery` command into `~/.local/bin`. It adds that folder to your shell's `PATH` if needed. It then starts the background service and configures your AI clients.

2. If the script reports it cannot verify the release, install a signature checker as the message suggests, or use Homebrew instead. Do not skip verification.

3. If the script asks for a pairing code, continue with [Pair devices](/rollout/pair-devices/). To pair later instead, press Enter at each prompt until the script moves on. It then logs that pairing failed. Ignore that message: the install still completes, and you can pair afterwards.

4. Open a new terminal and run `scenery doctor`.

   Expected: the daemon status shows running.

The script also works on macOS. Homebrew is the preferred path there because it handles upgrades.

## Upgrade

On Homebrew, run `brew upgrade scenery`. On the install script path, run the script again. Keep runners on a current release. A device on an old runner may show **Waiting on device (runner update needed)** in the admin portal for new installs until it is upgraded.

## What the employee sees

The installer's output is the whole experience. Nothing appears in the portal until the device is paired. The next step is [Pair devices](/rollout/pair-devices/).

## Remove the runner

`scenery uninstall` puts the computer back the way it was. It also signs the device out and removes it from your organization. See [Uninstalling restores, not deletes](/concepts/uninstalling/).

## Related

- [Employee install guide](/employees/install/)
- [Pair devices](/rollout/pair-devices/)
- [CLI reference](/reference/cli/)
- [Troubleshooting](/rollout/troubleshooting/)

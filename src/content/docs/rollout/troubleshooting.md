---
title: "Troubleshooting"
description: "Fixes for common problems."
sidebar:
  order: 8
---

Find the symptom you see and follow the fix. If a fix does not work, run `scenery doctor` on the affected laptop and have its output ready when you contact support.

## Invites and accounts

**The employee did not get the invite email.**
Ask them to check spam and search for mail from `noreply@scenery.dev`. If it is not there, open **Invites**, choose **Revoke** on the pending invite, and send a new one. Check the address for typos.

**The invite link says it is invalid or expired.**
Invite links work for 7 days and only once. Send a new invite from **Invites**.

**The new account asks for an organization name.**
The invite was sent with the wrong option in the menu. Revoke it and send it again with **Join org:** *your organization* selected. See [Invite users](/rollout/invite-users/).

**A person cannot sign in.**
Open **Users** and check their status. If it says **Revoked**, choose **Restore**. If it says **Active**, ask them to use **Forgot password?** on the sign-in page. The **Users** page also shows failed sign-ins for the last 30 days.

## Install and pairing

**The `scenery` command is not found after installing.**
Open a new terminal window. On the install script path, the script adds its folder to your shell's `PATH` and the change applies to new windows. See [Install the runner](/rollout/install-the-runner/).

**The install script refuses to continue because it cannot verify the release.**
Install a signature checker as the message suggests, or install with Homebrew. Do not bypass the check.

**`scenery doctor` says the daemon is not running.**
On macOS with Homebrew, run `brew services start scenery`. On any platform, `scenery daemon install` installs and starts the background service. Then run `scenery doctor` again.

**"Pairing code not found."**
The code was mistyped. Copy the full pairing command again from the portal.

**"Pairing code has expired or was already used."**
Codes work once and expire after about 10 minutes. Go to **My Devices**, expand **Add a new device** and choose **Refresh code**, then run the new command.

**The laptop does not appear in the portal after pairing.**
1. Check that the terminal printed **Paired successfully.**
2. Reload **My Devices**. It refreshes every few seconds, but a stale tab can lag.
3. Run `scenery doctor` and check the daemon and registry lines.
4. In the admin portal, open **Devices** and look for the hostname.

**The Install button is greyed out in the portal.**
The person has no paired device yet. Pair one first: see [Pair devices](/rollout/pair-devices/).

## Devices

**A device shows Needs re-auth.**
The person's sign-in on that laptop has expired. On the laptop, run `scenery auth login` and then `scenery daemon restart`.

**A device shows Offline or Stale.**
Offline means no check-in for about 5 minutes, which is normal for a closed laptop. Stale means more than 7 days. The device receives pending installs and removals when it next connects. If a laptop should be online, run `scenery doctor` on it.

**A device shows Waiting for agent.**
The device is registered but the runner has not started on it. Start it with `brew services start scenery` or `scenery daemon install`.

**An install is stuck at "Waiting on device (runner update needed)".**
The runner on that laptop is too old for the request. Upgrade it with `brew upgrade scenery`, or run the install script again.

**A device was revoked and the employee needs it back.**
Revoking a device is permanent. The employee runs `scenery auth pair` with a new code, and the laptop registers as a new device.

## Tools

**A tool is installed but Claude Code does not show it.**
Restart Claude Code. If it still does not appear, run `scenery mcp setup` and restart again.

**The employee sees "Connection expired" on an MCP server.**
Their sign-in to that service has lapsed. They choose **Reconnect** on the server's page in the portal (the button reads **Re-authorize** in some other cases) and sign in again.

**A server cannot be approved.**
Some servers need a working connection before approval. The portal says so on the server's page. Finish setting up its connection under the **Credentials** tab, then try again.

**A tool the employee wants does not appear in the catalog.**
It may be waiting for review, archived, blocked or revoked. Check **Review Queue**, **Skills**, **MCP Servers** and **Plugins**. Employees can ask for a new tool with [Request a tool](/employees/request-a-tool/).

**A revoked tool is still on a laptop.**
The progress line on the tool's page shows how many devices have removed it. Devices that are offline remove it when they reconnect.

## Still stuck

Collect the output of `scenery doctor` from the laptop, the time of the problem, and the person's email address, and send them to your Scenery account contact.

## Related

- [Install the runner](/rollout/install-the-runner/)
- [Pair devices](/rollout/pair-devices/)
- [CLI](/reference/cli/)

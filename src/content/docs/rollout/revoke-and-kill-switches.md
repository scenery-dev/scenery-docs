---
title: "Revoke and kill switches"
description: "Remove access quickly."
sidebar:
  order: 6
---

Scenery has a kill switch at each level: a tool, a device and a person. Use them when a tool turns out to be a problem, a laptop is lost, or someone leaves. Each one is controlled from the admin portal, so you do not need to touch the laptops. For the thinking behind each, see [Archive vs. revoke](/concepts/archive-vs-revoke/).

## Pick the right control

| Situation | Control | Effect |
|---|---|---|
| A tool is outdated but harmless | **Archive Skill** | Leaves the catalog. Devices that have it keep it. |
| A tool should not be used for new installs | **Block server** or **Block Plugin** | Marks it blocked in the catalog. Use **Revoke Access** to remove it from devices. |
| A tool must stop working now | **Revoke Access** | Removed from every device that has it. |
| A laptop is lost or retired | **Revoke Device** | That device is cut off for good. |
| A person has left | **Revoke** on **Users** | Their login, devices, installs and connected-service sign-ins are all cut off. |

## Revoke a tool everywhere

This works on skills, MCP servers and plugins.

1. Open the tool's page from **Skills**, **MCP Servers** or **Plugins** under **Govern**.

2. Choose **Revoke Access**.

   Expected: the page asks you to confirm and says how many devices the tool will be removed from. For example: "This will be removed from 3 devices immediately. Are you sure?"

3. Choose **Yes, Revoke**.

   Expected: a message confirms the revocation, then a progress line counts devices as they remove the tool, for example "Removed from 2 of 3 devices". The tool shows a **Revoked** badge.

4. Devices that are offline finish the removal when they reconnect. Watch the count rise to the full number.

To allow the tool again, choose **Unrevoke** on the same page. This allows future installs. It does not bring back copies that were already removed, so employees reinstall it themselves.

## Archive a skill

1. Open the skill under **Skills** and choose **Archive Skill**.
2. Choose **Yes, Archive**.

   Expected: the skill leaves the catalog and nobody can install it. Devices that already have it keep it. The skill and its history are kept.

3. To bring it back to the catalog, open it again and choose **Unarchive Skill**.

## Revoke a device

1. Open **Devices** under **Activity** and select the device.
2. Choose **Revoke Device** and confirm. The prompt says this is permanent and the employee will need to re-pair.

   Expected: the page shows when the device was revoked, and its skills, MCP servers and plugins are deactivated.

A revoked device cannot be restored. When the employee runs `scenery auth pair` again, the computer registers as a new device. See [Pair devices](/rollout/pair-devices/).

## Remove one tool from one device or from the whole organization

On a device's page, each installed tool has **Purge Device** and **Purge Org**.

1. Choose **Purge Device** to remove that tool from this device only, or **Purge Org** to remove it from every device in the organization.
2. Choose **Confirm**.

   Expected: a banner reports how many installations were purged, and the row shows **Removed**.

## Cut off a person

1. Open **Users** under **Activity**.
2. On the person's row, choose **Revoke**, then **Confirm** at the prompt "Cut off this user?".

   Expected: a banner reports how many devices were cut off, and how many skills, MCP servers, plugins and connected-service sign-ins were deactivated. The user's status changes to **Revoked**. They cannot sign in.

Only an admin can bring a person back. To do that:

1. On the same row, choose **Restore** and confirm at "Re-enable login?".

   Expected: the status returns to **Active** and the person can sign in again. Installs and connected-service sign-ins are not brought back. The person reinstalls tools and signs in to services again on their own. Their old devices stay revoked, so they pair again.

## Tell the employee

Removing a tool does not leave a laptop broken. Anything the employee had before Scenery stays in place. See [Uninstalling restores, not deletes](/concepts/uninstalling/).

## Related

- [Archive vs. revoke](/concepts/archive-vs-revoke/)
- [Devices and pairing](/concepts/devices-and-pairing/)
- [Users and organizations](/concepts/users-and-orgs/)
- [Reading audit logs](/rollout/reading-audit-logs/)

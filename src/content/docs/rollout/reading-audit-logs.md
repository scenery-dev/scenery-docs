---
title: "Reading audit logs"
description: "See what happened and who did it."
sidebar:
  order: 7
---

Scenery records what people and devices do with tools, and what admins change. Everything is in one place, the **Activity Log**. For the idea, see [The audit trail](/how-it-works/audit-trail/).

## Open the Activity Log

1. In the admin portal, open **Activity Log** under **Activity**.

   Expected: a page with source buttons at the top (**All Sources**, **MCP Audit**, **Gateway**, **Admin**, **Runner**), filters, and a table for each source with data.

2. Choose a source to narrow the page to one kind of event.

## What each source shows

| Source | What it answers |
|---|---|
| **Runner** | What happened on laptops: skill runs, installs and uninstalls, and tool calls. Columns: Timestamp, Event, Activity, User, Device. |
| **Gateway** | Calls to connected tools: time, server, user, tool, status, and the decision (**Allow**, **Deny**, **Block**, **Rate Limited** or **Warn**), plus how long each took. |
| **MCP Audit** | MCP server events such as servers accessed, tools called, configuration synced and access requested. Columns: Timestamp, Event, Server, User, Machine, Tool. |
| **Admin** | What admins changed: who, what action, which kind of item and which one. Expand a row to see the exact changes. |

## Find a specific event

1. Pick the source.
2. Use the filters for that source:
   - **Runner**: choose an event type (skill run, skill installed, skill uninstalled, tool called) and filter by email.
   - **Gateway**: filter by server, user email, tool name or decision.
   - **MCP Audit**: filter by server, email or event type.
   - **Admin**: filter by resource type, action or name. Actions include created, updated, deleted, activated, deactivated, blocked and unblocked.

   Expected: the table updates to matching rows. Expand a row to see its full details.

## Export

Choose **Export Gateway CSV**, **Export MCP CSV** or **Export Admin CSV** to download the matching events for your own records or tools.

## Other places to look

- **Dashboard** shows the last 24 hours at a glance: tool calls, allowed, denied or blocked, and reviews pending. It also lists top users and the busiest servers.
- **Users** shows each person's sign-ins for the last 30 days, with the method used and failed attempts.
- **Devices** shows each device's last check-in and what is installed.
- **Agent Sessions** appears under **Activity** once agent sessions have been recorded.

## Common questions

**Who approved this tool?** Open **Admin** and filter by the tool's name.

**Did the revocation reach every laptop?** Check the progress line on the tool's page, then the **Runner** source for uninstall events from the devices.

**Who was using a tool before I blocked it?** Open **Gateway** and filter by server.

## Related

- [The audit trail](/how-it-works/audit-trail/)
- [Revoke and kill switches](/rollout/revoke-and-kill-switches/)
- [Policies and access rules](/rollout/policies-and-access-rules/)

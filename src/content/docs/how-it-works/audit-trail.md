---
title: "Audit trail"
description: "What an admin can see."
sidebar:
  order: 4
---

Scenery keeps a record of what people and devices do with tools, and of what admins change. Admins read it in one place, the **Activity Log** in the portal.

## What is recorded

- **On laptops.** Tool installs and removals, skill runs and tool calls.
- **Connected tools.** Calls to connected services: which tool, which person, and whether it was allowed or denied.
- **Admin actions.** Who approved, blocked, revoked or changed something, and when.
- **Devices and people.** Each device's last check-in and what is installed on it, and each person's sign-ins.

## Why it matters

- Answer "who approved this tool?" and "who was using it before we blocked it?" without asking around.
- Confirm that a revocation reached every device.
- Export events as CSV for your own review tools.

Activity is reported to the control plane by the runner. A laptop that is offline reports when it reconnects.

For where to click, see [Audit logs](/rollout/audit-logs/).

## Related

- [Lifecycle](/how-it-works/lifecycle/)
- [Kill switches](/rollout/kill-switches/)

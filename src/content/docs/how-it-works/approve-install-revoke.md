---
title: "Approve, install, revoke"
description: "What happens at each step of a tool's life."
sidebar:
  order: 2
---

A tool moves through three steps. Admins control the first and last. Employees take the middle one.

## Approve

A builder publishes a tool, or the runner finds one already on a laptop. Nothing reaches employees until an admin approves it. Approval is recorded with who made it and when.

- Employees see only approved tools in the catalog.
- Every new version is a new decision.
- Tools adopted from laptops go through the same review.

See [Publishing and approval](/concepts/publishing-and-approval/) and [Review and approve tools](/rollout/review-and-approve/).

## Install

An employee picks an approved tool in the portal and chooses the device. The runner on that device sets it up and the tool appears in the AI client.

- Installing is a click. There is no extra step in a terminal.
- Tool definitions are verified before they run.
- Installs belong to one device. Sign-ins to connected services belong to the person, so a second laptop does not mean a second sign-in.
- If a tool needs a sign-in to a third-party service, the employee approves it once. They never see or hold the service's credentials.

See [Installs are per device, sign-ins are per user](/concepts/installs-and-sign-ins/) and [Brokered sign-in to tools](/concepts/brokered-sign-in/).

## Revoke

An admin can remove a tool from every device, cut off one device, or cut off a person, all from the portal.

- A device that is online removes the tool right away. A device that is offline finishes the job when it reconnects.
- The portal shows progress, for example how many devices have removed the tool.
- Removal puts the laptop back the way it was. Things the employee had before Scenery stay in place.

See [Revoke and kill switches](/rollout/revoke-and-kill-switches/) and [Uninstalling restores, not deletes](/concepts/uninstalling/).

## Related

- [Archive vs. revoke](/concepts/archive-vs-revoke/)
- [The audit trail](/how-it-works/audit-trail/)

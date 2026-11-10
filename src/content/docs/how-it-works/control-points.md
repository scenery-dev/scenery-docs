---
title: "Control points"
description: "What is decided on the device and what is decided centrally."
sidebar:
  order: 3
---

Scenery splits the work so that each half does what it is best placed to do.

## Decided centrally, by your admins

- Which tools are approved, blocked or archived.
- Who has an account, and which devices stay connected. Employees pair their own devices; admins can revoke any of them.
- Whether a tool, a device or a person has been cut off.
- How employees sign in to connected services. For services connected through Scenery's sign-in, this is handled for them, so they never hold those credentials.

These decisions are made once in the portal and apply everywhere. The control plane is the single record of them.

## Carried out on the device, by the runner

- Setting up an approved tool in the AI client, and removing it when it is revoked.
- Checking that a tool's definition is genuine before it runs.
- Keeping the laptop's setup consistent with what admins decided, including tools that only exist locally.
- Reporting what happened so it shows up in the audit trail.

## What this means for you

- Admins never have to visit a laptop to change policy.
- Tools already on a laptop are brought to admins for review rather than ignored.
- Both halves matter. Central control without an endpoint presence would miss local tools. An endpoint presence without central control would have nobody deciding.

## Related

- [Architecture](/how-it-works/architecture/)
- [Policies](/rollout/policies/)

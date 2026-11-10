---
title: "Accounts"
description: "Who can do what in your Scenery organization."
sidebar:
  order: 9
---

## What they are

An **organization** is your company's space in Scenery. It holds your users, devices, tools and policies. A **user** is one person with an account in it.

## Roles

Two roles exist: **member** and **admin**. Members use the catalog and their own devices. Admins also review tools, manage users and devices, and run the kill switches. You choose the role when you send an invite.

## Sign-ins belong to the user

A sign-in is a person's connection to a service such as Jira. It belongs to the user and follows them across all their devices, so an employee with two laptops signs in to Jira once. Cutting off a user ends their sign-ins everywhere. See [Kill switches](/rollout/kill-switches/).

## Why it works this way

Scenery is invite-only. Nobody joins your organization without an admin inviting them, so the user list is always what you expect.

## What an admin sees

- **Invites** lets you invite someone as **member** or **admin**, and revoke a pending invite.
- **Users** lists everyone with their status. **Revoke** cuts a user off, which also revokes their devices and their connections to services. **Restore** re-enables login but does not bring back installs, tool connections or devices. Old devices stay revoked: the person pairs each device again, reinstalls tools and reconnects to services. Only an admin can reinstate a user.

## Related

- [Invite users](/rollout/invite-users/)
- [Devices](/concepts/devices/)
- [Tool sign-in](/concepts/tool-sign-in/)
- [Archive and revoke](/concepts/archive-and-revoke/)

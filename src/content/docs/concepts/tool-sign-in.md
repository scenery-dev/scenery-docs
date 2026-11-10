---
title: "Tool sign-in"
description: "Employees connect to tools without handling credentials."
sidebar:
  order: 6
---

## What it is

Many tools connect to third-party services that need a sign-in. With brokered sign-in, Scenery handles that connection for the employee. The employee approves the connection once with the service, and Scenery keeps it working.

## Why it exists

- For services connected through Scenery's sign-in, employees never hold the credentials. Some tools use the employee's own API key instead. See [Sign in to connected tools](/employees/sign-in-to-connected-tools/).
- Admins can cut off access from one place, instead of chasing keys and tokens across laptops.
- The sign-in follows the person, not the laptop. See [Accounts](/concepts/accounts/).

Scenery does not host MCP servers. It only brokers the connection to the service.

## What an admin sees

Server pages under **MCP Servers** show how a server signs in. Some need a successful connection test before you can approve them. Revoking a user also removes their connections. See [Kill switches](/rollout/kill-switches/) and [Accounts](/concepts/accounts/).

## What an employee sees

On first use of a connected tool, the employee is asked to sign in to the service once. See [Sign in to connected tools](/employees/sign-in-to-connected-tools/).

## Related

- [Tool types](/concepts/tool-types/)

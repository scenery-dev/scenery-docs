---
title: "What is Scenery"
description: "The runner on every laptop and the control plane behind it."
sidebar:
  order: 1
---

Scenery is an AI tool governance platform. It lets IT teams decide which AI skills, MCP servers, plugins and agents their employees can use, and see how those tools are used. Employees get a curated set of tools that just work in Claude Code, Cursor and other AI clients.

Scenery has two halves that work together. Neither is optional.

## The runner, on every laptop

The runner is a small program that runs in the background on each employee's machine. It:

- Makes approved tools available in the employee's AI client.
- Sees the whole local tool surface, including tools the employee installed on their own, so nothing runs outside policy unnoticed.
- Acts on remote changes, such as removing a tool you have revoked.

The runner is open source. See [Under the hood](/under-the-hood/daemon-and-shim/) for how it works.

## The control plane, behind it

The control plane is what you use through the portal at app.scenery.dev. It is where you:

- Review and approve tools before they reach the whole organization.
- Invite users and see their devices.
- Let employees connect to third-party services through Scenery's sign-in without handling the credentials.
- Read the audit trail and cut off access from one place.

## Why both

The runner gives you coverage on the endpoint. The control plane gives you central approval, audit and revocation. Together, an approval decision made once in the portal reaches every device, and a revocation reaches every device just as fast.

## Where to go next

- New to Scenery? Follow the [Quickstart](/overview/quickstart/).
- Want the vocabulary first? Read [Skills, MCP servers, plugins and agents](/concepts/tool-types/).
- See [Who uses what](/overview/who-uses-what/) to find the pages for your role.

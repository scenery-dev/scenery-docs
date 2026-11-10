---
title: "Publishing and approval"
description: "How a tool becomes available to your organization."
sidebar:
  order: 3
---

## What it is

Publishing puts a tool into the catalog. Approval is the admin decision that lets the organization use it. Nothing reaches the catalog for the whole organization until an admin has approved it.

## Why it exists

You want to know what your employees run. Approval gives you a checkpoint for every new tool and every new version, and a record of who approved what.

## How it works for each type

- **Skills.** A builder publishes a skill from the portal or CLI. Skills that need review land in the **Review Queue**, with these choices: **Approve (Publish)** makes it available to the whole organization, **Approve (Private)** keeps it private to the submitter, and **Reject** declines it.
- **MCP servers.** Admins add servers with **+ Import** on the **MCP Servers** page, and imported servers start approved. Employee submissions come in through **MCP Submissions**, and access requests through **MCP Access Requests**. Use **Approve server** and **Block server** to change a server's status.
- **Plugins.** Approved or blocked as a whole version. See [Skills, MCP servers, plugins and agents](/concepts/tool-types/).

Some servers need a working connection before they can be approved. The portal tells you when it does.

## What an admin sees

The **Review Queue** shows everything waiting on you in one place, including tools the runner found on employees' laptops and adopted automatically. See [Adopting tools already on a laptop](/concepts/adopting-local-tools/).

## Related

- [Review and approve tools](/rollout/review-and-approve/)
- [Archive vs. revoke](/concepts/archive-vs-revoke/)

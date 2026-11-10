---
title: "Who uses what"
description: "How admins, employees and builders each use Scenery."
sidebar:
  order: 2
---

Scenery has three kinds of users. One person can be more than one.

## Admins

Admins are the IT and security people who roll Scenery out. They work in the portal at app.scenery.dev. They:

- Invite employees and manage [Accounts](/concepts/accounts/).
- Review and approve tools in the **Review Queue**, **MCP Servers** and **Plugins** pages.
- Watch devices, the **Activity Log** and **Shadow AI** discoveries.
- Revoke tools, devices and users when they need to.

Start with the [Quickstart](/overview/quickstart/), then the [Rollout guide](/rollout/install-the-runner/).

## Employees

Employees use approved tools in their AI client. They:

- Install the runner and [Devices](/concepts/devices/).
- Browse the catalog and install tools.
- Sign in once to services such as Jira or Slack that connect through Scenery's sign-in, with no credentials to manage. Some tools use the employee's own API key instead. See [Tool sign-in](/concepts/tool-sign-in/).
- Ask for tools that are not in the catalog yet.

Start with [Install the runner](/employees/install/).

## Builders

Builders write skills. A builder can be an employee who made a useful skill, or someone on the IT team. They:

- Author a skill as a `SKILL.md` file and publish it from the portal or the CLI.
- Wait for [Approval](/concepts/approval/) if their organization requires it.
- Adopt skills they already use so they are managed. See [Adoption](/concepts/adoption/).

The format is described in the [SKILL.md](/reference/skill-md/).

---
title: "Skills, MCP servers, plugins and agents"
description: "What each type of AI tool is."
sidebar:
  order: 1
---

Scenery governs four kinds of AI tool. Each is approved, installed and revoked the same way, but they do different things.

## Skills

A skill is a set of instructions, and optionally scripts, that teaches an AI client how to do a task, such as reviewing code to your team's standard. A skill is a folder with a `SKILL.md` file. See the [SKILL.md reference](/reference/skill-md/).

## MCP servers

An MCP server gives an AI client access to a system, such as Jira, Slack or GitHub. Scenery does not host MCP servers. They run where they already run: at the provider, or on the employee's machine. Scenery governs who may use them and, for services that need sign-in, brokers the connection. See [Brokered sign-in](/concepts/brokered-sign-in/).

## Plugins

A plugin bundles several things, such as skills, MCP servers and hooks, into one package. Plugins are approved and installed whole. You approve or block an entire plugin version, and you cannot install or trim single parts of it. Anthropic's official plugin marketplace is left alone: Scenery does not manage those plugins.

## Agents

Agents are governed alongside skills. They appear with skills in the portal catalog.

## What an admin sees in the portal

- Skills, MCP servers and plugins each have their own page under the admin navigation: **Skills**, **MCP Servers** and **Plugins**.
- Employees see the same three groups in the portal navigation, each with a **Browse** page.

## Related

- [The catalog and the registry](/concepts/catalog-and-registry/)
- [Publishing and approval](/concepts/publishing-and-approval/)

---
title: "Find and install tools"
description: "Browse the catalog and install what you need."
sidebar:
  order: 3
---

The portal catalog lists the tools your IT team has approved. Install one and it shows up in your AI client. For what the tool types mean, see [Skills, MCP servers, plugins and agents](/concepts/tool-types/).

## Before you start

You have [installed Scenery](/employees/install/), paired your laptop and [connected your AI client](/employees/connect-your-ai-client/).

## Browse the catalog

1. Sign in at [app.scenery.dev](https://app.scenery.dev) and open the left menu.

   Expected: three sections: **Skills**, **MCP Servers** and **Plugins**.

2. Choose **Browse** in the section you want.

   Expected: a list of approved tools with a short description each. Skills and plugins have a search box. Use the **All**, **Installed** and **Private to me** tabs to narrow the list.

Your home page also shows **New in your org**, so you can spot what was just added.

## Install a tool

1. Find the tool and choose **Install**.

   Expected: the button briefly shows **Queued** and then **Installing**, and ends as **Installed**. This usually takes a few seconds.

2. If you have more than one laptop, **Install** has a small arrow. Choose it to pick which devices get the tool, or all of them.

3. In Claude Code, type `/reload-skills` to use the tool right away.

Some tools need a sign-in first. Their button reads **Connect & Install**, **Connect API Key** or similar. See [Sign in to connected tools](/employees/sign-in-to-connected-tools/).

## What you might see instead of Install

| You see | What it means |
|---|---|
| **Blocked by IT** | Your IT team does not allow this tool. Ask them if you need it. |
| **Pending review** | A tool you submitted is waiting for IT approval. See [Request a tool](/employees/request-a-tool/). |
| **Waiting on this device** | Your laptop needs a newer Scenery. On a Mac run `brew upgrade scenery`; on Linux run the install script again. The install then finishes. |
| **Install failed** | Choose the retry button. If it keeps failing, tell your IT team. |
| **Install** is greyed out (hover: Install the Scenery agent first) | Your laptop is not set up yet. See [Install](/employees/install/). |
| **Managed by** *plugin name* | The tool came with a plugin. Manage it from the plugin's page. |

## Update a tool

When a newer version is available, it appears under **Needs your attention** on your home page. Choose **Update** there.

## Remove a tool

1. Choose **Remove** on the tool.
2. Confirm.

Expected: the tool disappears from your AI client. With more than one laptop, choose which devices to remove it from. Removing a tool from one laptop leaves your other laptops alone. See [Installs are per device, sign-ins are per user](/concepts/installs-and-sign-ins/).

## Next

- [Request a tool](/employees/request-a-tool/)
- [Sign in to connected tools](/employees/sign-in-to-connected-tools/)

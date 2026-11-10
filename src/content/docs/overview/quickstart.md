---
title: "Quickstart"
description: "What an admin does in their first 30 minutes."
sidebar:
  order: 3
---

This walks you through the shortest path from a new Scenery organization to an employee using an approved tool in Claude Code. You need an admin account and one employee with a laptop and Claude Code.

## 1. Sign in to the portal (2 minutes)

Go to [app.scenery.dev/admin/login](https://app.scenery.dev/admin/login) and sign in with your admin account. Scenery is invite-only, so you receive your admin invite by email.

## 2. Invite an employee (3 minutes)

1. In the admin portal, open **Invites** under Configure.
2. Enter the employee's email address. In the menu next to it, choose **Join org:** followed by your organization's name. A **Role** menu appears; leave it as **member**. Choose **Send invite**.

The employee gets an email with a link to set up their account. Details are in [Invite users](/rollout/invite-users/).

## 3. Employee installs the runner and pairs (10 minutes)

The employee signs in to the portal, chooses **Pair a device** on the home page (or opens **My Devices**), and expands **Add a new device**. The panel shows the install commands and a pairing command.

On macOS:

```bash
brew tap scenery-dev/tap && brew trust scenery-dev/tap && \
  brew install scenery && brew services start scenery
```

On Linux:

```bash
curl -fsSL https://install.scenery.dev | sh
```

Then they run the pairing command shown in the portal:

```bash
scenery auth pair <code>
```

Their laptop now appears under **Devices** in the admin portal. See [Install the runner](/rollout/install-the-runner/) and [Pair devices](/rollout/pair-devices/).

## 4. Approve a first tool (5 minutes)

As an admin, add an MCP server:

1. Open **MCP Servers** in the admin portal and choose **+ Import**.
2. Paste the server reference. Any common format works: an `npx` command, a JSON config or a URL.
3. Choose **Preview**, check the detected details, then choose **Add to Catalog**. Imported servers start as approved.
4. Open the server and check that its status is **approved**. Later, **Block server** stops new installs, and **Revoke Access** removes it from devices. See [Revoke and kill switches](/rollout/revoke-and-kill-switches/).

Skills that employees publish go to the **Review Queue**, where you choose **Approve (Publish)** or **Approve (Private)**. See [Review and approve tools](/rollout/review-and-approve/) and [Publishing and approval](/concepts/publishing-and-approval/).

## 5. Employee uses it in Claude Code (5 minutes)

The employee opens **MCP Servers** in the portal, finds the server and chooses **Install**. Some servers ask them to sign in to the service once. Then they open Claude Code, and the tool is available. See [Connect your AI client](/employees/connect-your-ai-client/) and [Find and install tools](/employees/find-and-install-tools/).

## 6. Check your work (5 minutes)

Back in the admin portal, open **Activity Log** to see what happened, and **Devices** to see the laptop's installs. See [Reading audit logs](/rollout/reading-audit-logs/).

## What next

- Set up [policies and access rules](/rollout/policies-and-access-rules/).
- Learn the kill switches in [Revoke and kill switches](/rollout/revoke-and-kill-switches/).
- Read the [Concepts](/concepts/tool-types/) to understand what you just did.

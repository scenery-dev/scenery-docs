---
title: "Approvals"
description: "Decide which tools your organization can use."
sidebar:
  order: 4
---

Nothing reaches the whole organization until an admin approves it. This page walks through each place work waits for you. For the idea behind it, see [Approval](/concepts/approval/).

## Start at the Review Queue

1. In the admin portal, open **Review Queue** under **Security**.

   Expected: two lists. **Skill submissions** are skills waiting for content review. **Auto-adopted tools** are skills, plugins and MCP servers that the runner found on employee laptops and adopted, waiting for your approval. Both refresh every 30 seconds. See [Adoption](/concepts/adoption/).

2. For each row, check the kind, name, who submitted it and when.

3. Choose one decision:
   - **Approve (Publish)** makes the tool available to the whole organization.
   - **Approve (Private)** approves it but keeps it private to the person who submitted it.
   - **Reject** asks for a reason, which you must enter.

   Expected: a confirmation banner appears and the row leaves the queue.

To decide several adopted tools at once, tick their checkboxes. A bar shows how many are selected, with **Approve & publish**, **Approve (private)**, **Reject** and **Clear**.

## Add an MCP server yourself

1. Open **MCP Servers** under **Govern** and choose **+ Import**.

   Expected: a panel with two tabs, **Paste command / package** and **Remote server (URL + token)**.

2. On the first tab, paste the server in any common form: an `npx` command, a JSON config, a package name or a URL. Choose **Preview**.

   Expected: the panel shows the detected name, package, command and format. If the server is already in the catalog, it says so.

3. Choose **Add to Catalog**.

   Expected: the server appears under **Installed Servers** with status **approved**. Employees can now find it in the portal.

4. For a remote server, use the second tab instead: enter a name, the server URL and a token, then choose **Add remote server**.

## Review what employees submit

1. Open **MCP Submissions** under **Govern**.

   Expected: a list titled **Pending MCP Submissions**, showing servers employees have configured and sent for approval.

2. Choose **Approve** to accept one, or **Reject** and enter a reason.

   Expected: approved servers move into the catalog.

Access requests for servers that need approval appear on **MCP Servers** under **Pending Access Requests**, each with **Approve** and **Reject**. How many requests need your decision depends on the approval mode you set in [Policies](/rollout/policies/).

Some servers need a working connection before they can be approved. The portal tells you when that is the case.

## Approve or block an existing server

1. On **MCP Servers**, open a server.

   Expected: its page shows **Current status**.

2. Choose **Block server** to stop new use, or **Approve server** to allow it again.

   Expected: the status changes. To also remove it from devices that already have it, use **Revoke Access** as described in [Kill switches](/rollout/kill-switches/).

## Plugins

1. Open **Plugins** under **Govern** and select a plugin. On a version with status pending review, choose **Review**.

   Expected: a panel lists the parts inside that version. Devices keep the last approved version until the new one is approved, and nothing is removed in the meantime.

2. Choose **Approve version** or **Block version**. You can add an optional review note.

   Expected: the decision is recorded. If the version has findings that stop approval, the button reads **Approve anyway** and asks you to explain why it is safe. The explanation is saved in the audit log.

You can also block or unblock a whole plugin with **Block Plugin** and **Unblock Plugin**.

## Skills

Skills that need review appear in the Review Queue. Open **Skills** under **Govern** to see every skill with its status. A skill's page shows its versions and has the controls for archiving and revoking. See [Archive and revoke](/concepts/archive-and-revoke/).

## Related

- [Approval](/concepts/approval/)
- [Policies](/rollout/policies/)
- [Request a tool](/employees/request-a-tool/)

---
title: "Policies and access rules"
description: "Control who can use which tools."
sidebar:
  order: 5
---

This page covers the controls the admin portal gives you today for deciding what employees can use. Approval, blocking and revoking are described in [Review and approve tools](/rollout/review-and-approve/) and [Revoke and kill switches](/rollout/revoke-and-kill-switches/).

## Set how access requests are handled

The approval mode controls how requests for MCP servers are decided across your organization.

1. Open **Settings** under **Configure**.

   Expected: an **Approval Mode** section with three cards. The active one is highlighted.

2. Choose one:
   - **Trust**: requests are approved automatically and IT is alerted. You can still revoke. Suits fast-moving teams.
   - **Catalog Only**: servers already approved in your catalog are available at once, and unknown servers need IT approval. Recommended for most organizations.
   - **Strict**: every request needs manual IT approval. For regulated industries.

   Expected: the card you picked becomes active and the change applies to new requests straight away.

Start with **Catalog Only**. Move to **Strict** if your rules require a decision for every request.

## Decide per server

Each server in the catalog is **approved** or **blocked**.

1. Open **MCP Servers** and select a server.
2. Choose **Block server** or **Approve server**.

   Expected: the page shows the new **Current status**.

## Decide per tool on a server

For servers that expose several tools, you can switch individual tools on or off and change how each is approved.

1. Open the server's page from **MCP Servers**.

   Expected: tabs for **Tools**, **Config**, **Credentials**, **Policies** and **Filters**. **Tools** is selected.

2. Choose **Discover Tools** if the table is empty.

   Expected: a **Discovered Tools** table lists each tool with its Status, Approval and Enabled columns.

3. Use the **Enabled** switch to turn a tool on or off. Choose **Edit** on a row to change its approval to **inherit**, **auto_approve**, **catalog_auto** or **manual**. **Inherit** follows the organization's approval mode.

   Expected: the row shows the new status and approval.

## Allow or deny tools by rule

The **Policies** tab on a server's page sets the overall posture for that server.

1. Open the **Policies** tab.

   Expected: either the current policy, or a note that no policy is configured and all tools pass through. If the tab says the server has no connection set up yet, set it up on the **Credentials** tab first.

2. Create a policy and pick its type: **Allow All**, **Role-Based** or **Deny All**.

   Expected: the policy type shows as selected. **Deny All** blocks every tool on that server.

3. For **Role-Based**, choose **+ Add Rule**. Enter a tool pattern such as `create_*`, a role, an action of **Allow** or **Deny**, and a priority. Save the rule.

   Expected: the rule appears in the **Tool Rules** table. When rules overlap, the highest priority wins.

   Use `*` as the role to apply a rule to everyone. Rule roles are separate from the **member** and **admin** account roles you pick when inviting someone.

Use **Delete** on a rule, or **Delete Policy**, to remove it.

## Find unmanaged tools

**Shadow AI** under **Security** lists MCP servers and other AI client settings that the runner found on employee laptops outside Scenery. For a server, choose **Bring into governance** to create a catalog entry for review.

**Managed Paths** under **Security** sets how the runner treats unmanaged files in managed folders. The modes are **Audit only**, **Warn**, **Quarantine** and **Approve required**. **Audit only** is the safe starting point for a rollout: it records what it finds and changes nothing on the laptop.

## Related

- [Publishing and approval](/concepts/publishing-and-approval/)
- [Review and approve tools](/rollout/review-and-approve/)
- [Reading audit logs](/rollout/reading-audit-logs/)

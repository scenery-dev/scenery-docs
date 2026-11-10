---
title: "Sign in to connected tools"
description: "Connect your own accounts to tools."
sidebar:
  order: 5
---

Some tools connect to services such as Jira or Slack. For tools that use a service sign-in, you sign in once through Scenery and never give the tool your password. Your sign-in follows you, so a second laptop does not ask you again. See [Tool sign-in](/concepts/tool-sign-in/).

## Connect a tool with a service sign-in

1. In the portal, find the tool and choose **Connect & Install**.

   Expected: the button shows **Opening** and then **Authorizing**, and a sign-in window for the service opens.

2. Sign in to the service and approve access.

   Expected: the window closes and the tool installs. In Claude Code, type `/reload-skills` to use it.

If the window does not open, allow pop-ups for the portal and try again.

## Connect a tool that uses an API key

1. Choose **Connect API Key**.
2. Paste your key. Add a label if you want, such as **personal** or **work**.
3. Choose **Save Key**, then **Install**.

   Expected: the button shows **Key Saved**, then **Installed**.

To swap the key later, choose **Update key** on the installed tool.

## Tools your IT team signs in for you

Some tools show **IT-managed credentials**. IT set these up once for everyone. Just choose **Install**.

A few tools run only on your laptop and show **Self-managed credential**. Those need your own credential, and the tool's card tells you what to provide.

## When a connection expires

Sign-ins can lapse, for example after a password change at the service. You will see:

- **Needs to be reconnected** with a **Connect** button under **Needs your attention** on your home page.
- **Connection expired** with a **Reconnect** button on the tool. On an installed tool you can also choose **Re-authorize** at any time to sign in again.

Choose the button and sign in again. Nothing else changes: the tool stays installed.

## If your access is cut off

If your IT team revokes your access, your connections end everywhere and the tools leave your devices. Contact your IT team. See [Accounts](/concepts/accounts/).

## Related

- [Find and install tools](/employees/find-and-install-tools/)
- [Accounts](/concepts/accounts/)

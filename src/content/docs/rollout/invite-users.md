---
title: "Invite users"
description: "Bring your team into Scenery."
sidebar:
  order: 2
---

Scenery is invite-only. Nobody joins your organization unless an admin invites them. See [Users and organizations](/concepts/users-and-orgs/) for the two roles, **member** and **admin**.

## Send an invite

1. Sign in to the admin portal at [app.scenery.dev/admin/login](https://app.scenery.dev/admin/login) with your admin email and password.

   Expected: you land on the dashboard with the **Govern**, **Security**, **Activity** and **Configure** groups in the left navigation.

2. Under **Configure**, open **Invites**.

   Expected: a form with an email field and a list of past invites, each with its email, type and status.

3. Enter the employee's work email address.

4. In the target menu, choose **Join org: your organization name**. Do not leave it on **New org**, which sends an invitation to start a separate organization.

   Expected: a **Role** menu appears next to it.

5. Choose **member** for employees, or **admin** for people who will manage Scenery.

6. Choose **Send invite**.

   Expected: the invite appears in the list with status **pending**. The employee receives an email from `noreply@scenery.dev` with a link to set up their account.

## What the employee does

1. They open the link in the email.

   Expected: a **Welcome** page that names their email address.

2. They enter a name and a password and choose **Create account**.

   Expected: they are signed in to the portal. Their next step is to [pair their device](/rollout/pair-devices/).

An invite link works for 7 days. After that it shows as invalid or expired, and you send a new one.

## Revoke a pending invite

1. On **Invites**, find the invite with status **pending**.
2. Choose **Revoke**.

   Expected: the status changes to **revoked** and the link stops working.

## Check who has joined

Open **Users** under **Activity**. Each person is listed with their status, last login, and number of devices. Expand a row to see their recent sign-ins, devices and invites. An invited person appears here once they accept.

To remove someone's access later, see [Revoke and kill switches](/rollout/revoke-and-kill-switches/).

## Related

- [Users and organizations](/concepts/users-and-orgs/)
- [Pair devices](/rollout/pair-devices/)
- [Troubleshooting](/rollout/troubleshooting/)

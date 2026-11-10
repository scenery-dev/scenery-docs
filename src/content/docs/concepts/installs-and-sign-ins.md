---
title: "Installs are per device, sign-ins are per user"
description: "Where a tool is installed versus who is signed in to it."
sidebar:
  order: 5
---

## What it is

Two things are easy to mix up:

- **An install** puts a tool in one device's configuration. It belongs to that device.
- **A sign-in** is a person's connection to a service such as Jira. It belongs to the user and follows them across all their devices.

## Why it works this way

An employee with two laptops should not have to sign in to Jira twice. And an admin should be able to remove a tool from a lost laptop without cutting the employee off from their other devices.

## In practice

- Installing a tool on a second device adds the tool to that device only. The employee does not sign in again.
- Removing a tool from one device leaves their other devices alone.
- Employees with more than one device pick the target device when they install.
- Cutting off a user ends their sign-ins everywhere. See [Revoke and kill switches](/rollout/revoke-and-kill-switches/).

## What an admin sees

**Devices** in the admin navigation shows each device and what is installed on it. **Users** shows each person.

## Related

- [Devices and pairing](/concepts/devices-and-pairing/)
- [Brokered sign-in to tools](/concepts/brokered-sign-in/)

---
title: "Architecture"
description: "The runner, the control plane and your AI client."
sidebar:
  order: 1
---

Scenery has three parts. Two of them are Scenery: the runner on each laptop and the control plane behind it. The third is the AI client your employees already use.

![Diagram with three boxes. The AI client exchanges tools and requests with the Scenery runner. The Scenery runner exchanges approved tools and activity with the Scenery control plane.](/architecture.svg)

## AI client

Claude Code, Cursor, VS Code and other clients. The client asks Scenery for tools the same way it would ask any other tool source. Employees do not change how they work.

## Scenery runner

A small program on each laptop. It gives the AI client the tools the organization has approved, and it keeps the laptop in line with what admins decide. Because it sits on the device, it also sees tools that never touch the network. The runner is open source. See [Under the hood](/under-the-hood/daemon-and-shim/).

## Scenery control plane

The portal and services at app.scenery.dev. This is where admins approve tools, invite people, see devices, read the audit trail and cut off access. It is the central record of who may use what.

## Why there are two halves

The runner covers the endpoint. The control plane covers the organization. An admin decision made once in the portal reaches every device, and what happens on every device is recorded centrally.

## Related

- [Lifecycle](/how-it-works/lifecycle/)
- [Control points](/how-it-works/control-points/)
- [What is Scenery](/overview/what-is-scenery/)

---
title: "Sync and signing"
description: "How the runner stays current with your policy."
sidebar:
  order: 2
---

## Staying current

The runner keeps a laptop in line with what admins decide. When an admin approves a tool, revokes one, or changes policy, the change reaches online devices quickly. A laptop that was offline catches up when it reconnects.

## Definitions are verified before they run

Tool definitions, plugins and policy come from your Scenery organization. The runner checks that each one is genuine before acting on it. Something that fails the check is not run.

For employees this means a tool is checked against what your organization approved before it runs. For admins it means a revoked tool comes back only on a verified decision from your organization.

## Installs on click

Installing a tool does not ask the employee to approve anything in a terminal. The check happens automatically, and the tool is available once it passes.

## Releases

The install script checks that the runner it downloads is the one Scenery published before installing it. See [Install the runner](/rollout/install-the-runner/).

## Related

- [Lifecycle](/how-it-works/lifecycle/)
- [Changelog](/reference/changelog/)

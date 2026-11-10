---
title: "Sync and signed definitions"
description: "How the runner stays current with your policy."
sidebar:
  order: 2
---

## Staying current

The runner keeps a laptop in line with what admins decide. When an admin approves a tool, revokes one, or changes policy, the change reaches online devices quickly. A laptop that was offline catches up when it reconnects.

## Definitions are verified before they run

Tool definitions, plugins, policy and revocations come from your Scenery organization. The runner checks that each one is genuine before acting on it. Something that fails the check is not run.

For employees this means a tool is checked against what your organization approved before it runs. For admins it means the runner acts only on revocations that came from your Scenery organization.

## Installs on click

Installing a tool does not ask the employee to approve anything in a terminal. The check happens automatically, and the tool is available once it passes.

## Releases

The install script checks that the runner it downloads is the one Scenery published before installing it. See [Install the runner](/rollout/install-the-runner/).

## Related

- [Approve, install, revoke](/how-it-works/approve-install-revoke/)
- [Changelog](/reference/changelog/)

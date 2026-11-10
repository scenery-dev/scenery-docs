---
title: "SKILL.md and the metadata.scenery namespace"
description: "How Scenery extends the SKILL.md standard."
sidebar:
  order: 5
---

Scenery skills use the standard SKILL.md format, so they stay portable. The top level of the frontmatter holds only the standard keys: `name`, `description`, `license` and `metadata`.

Everything specific to Scenery sits under `metadata.scenery`: version, publisher, permissions, execution limits, model preferences, schemas, triggers, workflow and declared tools. A skill that uses none of them is still a valid standard skill.

Putting extensions in one namespace means other tools can ignore what they do not understand, and Scenery never claims top-level keys the standard may use later. Top-level keys that start with `vh_` are rejected.

For every key, see the [SKILL.md reference](/reference/skill-md/).

## Related

- [Publishing and approval](/concepts/publishing-and-approval/)

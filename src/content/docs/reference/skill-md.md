---
title: "SKILL.md reference"
description: "The SKILL.md authoring format."
sidebar:
  order: 2
---

A skill is a folder with a `SKILL.md` file at its root. The file starts with a YAML frontmatter block between two `---` lines. The Markdown after it is the skill's prompt. Run `scenery skill validate <folder>` to check a skill, and `scenery skill init <name>` to scaffold one.

## Top-level keys

Only `name`, `description`, `license` and `metadata` are allowed at the top level.

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | Unique skill name. Lowercase letters, digits and hyphens, starting and ending with a letter or digit. Up to 64 characters. |
| `description` | string | yes | What the skill does, shown in the catalog and to your AI client. 10 to 280 characters. |
| `license` | string | no | An SPDX license identifier such as `Apache-2.0` or `MIT`. |

Everything specific to Scenery goes under `metadata.scenery`.

> **Note:** Top-level keys that start with `vh_` (for example `vh_permissions`) are rejected. Move them under `metadata.scenery` and drop the prefix, so `vh_permissions` becomes `metadata.scenery.permissions`. Unknown keys under `metadata.scenery` are rejected too.

## `metadata.scenery` keys

All are optional.

| Key | Type | Default | What it declares |
| --- | --- | --- | --- |
| `version` | string (semver) | `0.1.0` | The skill's version, for example `1.2.0`. |
| `publisher` | string | `local` | Who published the skill. Set for you when you publish. |
| `permissions` | object | all `none` | What the skill says it needs. See below. |
| `execution` | object | see below | How the skill says it should run. See below. |
| `model` | object | none | Model preferences. See below. |
| `schemas` | object | none | `inputs` and `outputs`: JSON Schema documents describing what the skill takes and returns. |
| `workflow` | list of steps | one prompt step built from the Markdown body | Inline steps. Each step has an `id` and a `type` of `tool`, `llm`, `transform` or `validate`. |
| `workflow_ref` | string | none | Path to a YAML file holding the steps. Use either `workflow` or `workflow_ref`, not both. |
| `triggers` | list of strings | empty | Phrases that help your AI client decide when to use the skill. Lowercased and de-duplicated. At most 10, each 3 to 200 characters. |
| `type` | string | none | A tag for the kind of skill, for example `skill`. |
| `declared_tools` | list of strings | empty | Tools the skill says it uses. |

### `permissions`

| Key | Values | Default |
| --- | --- | --- |
| `network` | `none`, `restricted`, `full` | `none` |
| `filesystem` | `none`, `read-only`, `full` | `none` |
| `clipboard` | `none`, `read`, `write`, `full` | `none` |

These declare what access the skill asks for, so reviewers can see it before approving. Unknown keys are rejected.

### `execution`

| Key | Type | Default |
| --- | --- | --- |
| `timeout_ms` | integer | `120000` |
| `memory_mb` | integer | `512` |
| `sandbox` | `strict`, `relaxed`, `unrestricted` | `strict` |

Like `permissions`, these are declarations the skill makes about how it expects to run, so reviewers can see them before approving. Unknown keys are rejected.

### `model`

| Key | Type | What it declares |
| --- | --- | --- |
| `min_params_b` | number | Smallest model size the skill works with, in billions of parameters. |
| `recommended` | list of strings | Preferred models, in order. |
| `fallback` | `mcp_sampling` or `error` | What to do when no recommended model is available. |
| `prefer_local` | boolean | Try a model running on the device first. Defaults to `false`, which uses your AI client's model. |

## Example

```markdown
---
name: summarize-meeting-notes
description: Turns raw meeting notes into a short summary with action items.
license: Apache-2.0
metadata:
  scenery:
    version: 1.0.0
    triggers:
      - summarize my meeting notes
      - pull out action items
    permissions:
      network: none
      filesystem: read-only
      clipboard: none
    execution:
      timeout_ms: 60000
      memory_mb: 512
      sandbox: strict
    model:
      min_params_b: 7
      prefer_local: false
      fallback: mcp_sampling
---

Read the notes the user provides. Write a summary of at most five sentences,
then list each action item with its owner.
```

If you leave out `workflow` and `workflow_ref`, the Markdown body becomes the skill's prompt.

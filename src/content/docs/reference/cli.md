---
title: "CLI"
description: "Commands that admins and employees run."
sidebar:
  order: 1
---

This reference covers the `scenery` command-line tool, version 2.2.1. The short alias `scn` works for every command. Run `scenery <command> --help` for the same text on your machine.

Pairing a device starts in the portal: open **My Devices**, choose **Add a new device**, and copy the code it shows. Then run `scenery auth pair <code>`. Where the help text below mentions a setup screen on the catalog page, use **My Devices** > **Add a new device**.

## Health

Check that this device is set up correctly.

### `scenery doctor`

```text
Print health status: daemon reachability, local data, versions

Usage: scenery doctor [OPTIONS]

Options:
      --registry-url <REGISTRY_URL>  Registry URL to probe for reachability check [env: SCENERY_REGISTRY_URL=]
  -h, --help                         Print help
```

## Authentication

Sign in, pair a device, or use a token for headless machines.

### `scenery auth login`

```text
Log in to the Scenery registry using an OAuth browser flow

Usage: scenery auth login [OPTIONS]

Options:
      --registry-url <REGISTRY_URL>  Registry base URL [env: SCENERY_REGISTRY_URL=] [default: https://app.scenery.dev]
  -h, --help                         Print help
```

### `scenery auth logout`

```text
Log out of the Scenery registry

Usage: scenery auth logout [OPTIONS]

Options:
      --registry-url <REGISTRY_URL>  Registry base URL [env: SCENERY_REGISTRY_URL=] [default: https://app.scenery.dev]
  -h, --help                         Print help
```

### `scenery auth status`

```text
Show current authentication status

Usage: scenery auth status [OPTIONS]

Options:
      --registry-url <REGISTRY_URL>  Registry base URL [env: SCENERY_REGISTRY_URL=] [default: https://app.scenery.dev]
  -h, --help                         Print help
```

### `scenery auth token`

```text
Save a Personal Access Token for headless / CI environments.

Create a scn_pat_... token in the Scenery portal, then run `scenery auth token` and paste it at the hidden prompt, or pipe it in on stdin, e.g. `scenery auth token < pat.txt`.

The token is never accepted as a command-line argument: arguments are visible to other local users in the process list and are kept in shell history.

Or set SCENERY_TOKEN=<scn_pat_...> and restart the daemon.

Usage: scenery auth token [OPTIONS]

Options:
      --registry-url <REGISTRY_URL>
          [env: SCENERY_REGISTRY_URL=]
          [default: https://app.scenery.dev]

  -h, --help
          Print help (see a summary with '-h')
```

### `scenery auth pair`

```text
Pair this device using a code from the Scenery portal.

In the portal, open the catalog page — if this device isn't registered yet you'll see a setup screen with a pairing code.  Then run: scenery auth pair <code>

This registers the device and authenticates the CLI in one step, without a separate browser login.

The code argument is optional — when omitted it's resolved, in order: the SCN_PAIR_CODE env var (used without prompting); otherwise an interactive prompt, if a terminal is available; otherwise the command exits non-zero with an error naming both escapes.

Usage: scenery auth pair [OPTIONS] [CODE]

Arguments:
  [CODE]
          The pairing code shown in the portal (e.g. SCN-7X4K-9M2P). Optional: falls back to SCN_PAIR_CODE, then an interactive prompt when a terminal is available

Options:
      --registry-url <REGISTRY_URL>
          [env: SCENERY_REGISTRY_URL=]
          [default: https://app.scenery.dev]

  -h, --help
          Print help (see a summary with '-h')
```

## AI client integration

Connect Scenery to Claude Code and trigger a sync.

### `scenery mcp setup`

```text
Write the Scenery MCP entry into the specified AI client's config

Usage: scenery mcp setup [OPTIONS]

Options:
      --client <CLIENT>   Target AI client (currently only "claude-code" is supported)
      --dry-run           Print the config entry that would be written without modifying any files
      --rotate-local-key  Issue a new local connection key; reconnect your AI client afterwards. Without this flag your existing key is kept
  -h, --help              Print help
```

### `scenery mcp remove`

```text
Remove the Scenery MCP entry from all AI client configs and delete Scenery slash command skill directories from the Claude Code skills directory.

Run this before `brew uninstall scenery` to leave AI client configs clean.

Usage: scenery mcp remove

Options:
  -h, --help
          Print help (see a summary with '-h')
```

### `scenery mcp sync`

```text
Trigger an immediate registry sync via the daemon

Usage: scenery mcp sync

Options:
  -h, --help  Print help
```

### `scenery mcp backends`

```text
List registered backends and their health status

Usage: scenery mcp backends

Options:
  -h, --help  Print help
```

## Skills

Find, install, author and publish skills.

### `scenery skill list`

```text
List all installed skills

Usage: scenery skill list

Options:
  -h, --help  Print help
```

### `scenery skill search`

```text
Search the skill registry for available skills

Usage: scenery skill search [OPTIONS] <QUERY>

Arguments:
  <QUERY>  Search query (keyword or partial skill name)

Options:
      --registry-url <REGISTRY_URL>  Registry base URL [env: SCENERY_REGISTRY_URL=] [default: https://app.scenery.dev]
  -h, --help                         Print help
```

### `scenery skill install`

```text
Install a skill from a local bundle directory or a registry ID.

SKILL_REF is treated as a local path if the path exists on disk; otherwise it is sent to the registry as an ID.

Registry installs are device-scoped by default: the skill is installed only on the device running this command, matching `skill uninstall`. Pass `--all-devices` to fan the install out to every device registered to your account (the old default).

Usage: scenery skill install [OPTIONS] <SKILL_REF>

Arguments:
  <SKILL_REF>
          Local bundle directory path or registry skill ID

Options:
      --link
          Symlink instead of copying the bundle (Unix only, dev mode). Ignored for registry installs

      --registry-url <REGISTRY_URL>
          Registry base URL (registry installs only)

          [env: SCENERY_REGISTRY_URL=]

      --all-devices
          Install on every device registered to your account instead of just this one (registry installs only)

      --version <VERSION>
          Pin to a specific registry version instead of latest (registry installs only)

  -h, --help
          Print help (see a summary with '-h')
```

### `scenery skill info`

```text
Show detailed information about an installed skill

Usage: scenery skill info <ID>

Arguments:
  <ID>  Skill ID to inspect

Options:
  -h, --help  Print help
```

### `scenery skill update`

```text
Update an installed skill to the latest registry version.

With <id>: check the registry for the latest version of that skill and install it if newer than what is currently installed.

With --all: do the same for every installed skill.

With neither: print usage.

Usage: scenery skill update [OPTIONS] [ID]

Arguments:
  [ID]
          Skill ID to update. Mutually exclusive with --all

Options:
      --all
          Update all active installed skills

      --registry-url <REGISTRY_URL>
          Registry base URL

          [env: SCENERY_REGISTRY_URL=]
          [default: https://app.scenery.dev]

  -h, --help
          Print help (see a summary with '-h')
```

### `scenery skill uninstall`

```text
Uninstall (remove) a locally installed skill.

Removes the skill's local install and records.

If your organization installed the skill for you, it is also deactivated so it is not reinstalled on the next sync.

Usage: scenery skill uninstall [OPTIONS] <ID>

Arguments:
  <ID>
          Skill ID to remove

Options:
      --registry-url <REGISTRY_URL>
          Registry base URL

          [env: SCENERY_REGISTRY_URL=]
          [default: https://app.scenery.dev]

  -h, --help
          Print help (see a summary with '-h')
```

### `scenery skill init`

```text
Scaffold a new SKILL.md-rooted skill

Usage: scenery skill init [OPTIONS] <NAME>

Arguments:
  <NAME>  Skill name (becomes the directory and the `name` frontmatter field)

Options:
      --output-dir <OUTPUT_DIR>  Target parent directory (default: current directory)
  -h, --help                     Print help
```

### `scenery skill author`

```text
Author a new skill interactively, with heuristic recommendations.

Prompts for skill name and system prompt if not provided as flags. Runs the heuristic engine and presents recommendations for permissions, model sizing, execution constraints, and trigger phrases.

Usage: scenery skill author [OPTIONS]

Options:
      --name <NAME>
          Skill name (becomes directory name and frontmatter `name` field)

      --prompt-file <FILE>
          Path to a file containing the system prompt text

      --accept-suggestions
          Automatically apply all recommendations without interactive prompts

      --skip-metadata
          Skip all metadata recommendations; scaffold with hardcoded defaults

      --output-dir <OUTPUT_DIR>
          Target parent directory (default: current directory)

      --registry-url <REGISTRY_URL>
          Registry URL used to look up your publisher ID (defaults to production)

          [env: SCENERY_REGISTRY_URL=]

  -h, --help
          Print help (see a summary with '-h')
```

### `scenery skill validate`

```text
Validate a skill bundle directory

Usage: scenery skill validate <PATH>

Arguments:
  <PATH>  Path to the skill bundle directory

Options:
  -h, --help  Print help
```

### `scenery skill publish`

```text
Publish a SKILL.md-rooted skill to the registry

Usage: scenery skill publish [OPTIONS] --registry-url <REGISTRY_URL> <PATH>

Arguments:
  <PATH>  Path to the skill directory (must contain SKILL.md)

Options:
      --registry-url <REGISTRY_URL>  Registry base URL [env: SCENERY_REGISTRY_URL=]
      --dry-run                      Compile and validate without creating a registry entry
      --on-duplicate <ACTION>        How to resolve a detected duplicate (same content under a different name in your org): use-existing, new-version, fork, or force. Without this, publish is blocked with a similarity report so you can choose
      --fork-name <FORK_NAME>        New skill name to use when --on-duplicate=fork
  -h, --help                         Print help
```

## Plugins

Install and remove governed plugins.

### `scenery plugin install`

```text
Install a governed plugin from the registry.

Requests the install via the portal; the daemon then registers it as a self-contained Claude Code plugin (it appears in `/plugin list`, bundling its skills). Requires `scenery auth login`.

Device-scoped by default: installs only on the device running this command. Pass `--all-devices` to fan the install out to every device registered to your account (the old default).

Usage: scenery plugin install [OPTIONS] <SLUG>

Arguments:
  <SLUG>
          Plugin slug to install (as shown in the catalog)

Options:
      --version <VERSION>
          Specific version to install; omit for the latest published version

      --registry-url <REGISTRY_URL>
          [env: SCENERY_REGISTRY_URL=]
          [default: https://app.scenery.dev]

      --all-devices
          Install on every device registered to your account instead of just this one

  -h, --help
          Print help (see a summary with '-h')
```

### `scenery plugin uninstall`

```text
Uninstall (remove) a locally installed plugin.

Removes the plugin from this device and stops it from being reinstalled on the next sync.

Usage: scenery plugin uninstall [OPTIONS] <SLUG>

Arguments:
  <SLUG>
          Plugin slug to remove (as shown in `claude plugin list`)

Options:
      --registry-url <REGISTRY_URL>
          [env: SCENERY_REGISTRY_URL=]
          [default: https://app.scenery.dev]

  -h, --help
          Print help (see a summary with '-h')
```

## Background service

Install or restart the background service that keeps this device in sync.

### `scenery daemon install`

```text
Install the scenery LaunchAgent (macOS) or systemd user unit (Linux)

Usage: scenery daemon install

Options:
  -h, --help  Print help
```

### `scenery daemon restart`

```text
Stop and start the daemon in place. Picks up a refreshed auth token or environment changes without re-running install

Usage: scenery daemon restart

Options:
  -h, --help  Print help
```

## Removal

Remove Scenery from this device.

### `scenery uninstall`

```text
Remove Scenery and restore the host to its pre-install state.

Unwinds every external change in reverse — stops the daemon, strips the scenery entries from all AI client configs, removes brokered MCP servers completely (they can't run without the runner), restores anything Scenery took over, and writes a restore report listing what was removed, what was kept, and what to re-add on your own configuration.

Usage: scenery uninstall [OPTIONS]

Options:
  -y, --yes
          Skip the confirmation prompt

      --purge
          Also delete Scenery's local data and saved sign-in

      --dry-run
          Show the plan and report without changing anything

      --report-dir <REPORT_DIR>
          Directory to write the restore report into (default: home)

      --registry-url <REGISTRY_URL>
          Registry URL used to deregister this device

          [env: SCENERY_REGISTRY_URL=]

  -h, --help
          Print help (see a summary with '-h')
```

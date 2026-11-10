---
title: "Connect your AI client"
description: "Set up Claude Code, Cursor and others."
sidebar:
  order: 2
---

Scenery has to be added to your AI client once. After that, every tool you install from the portal shows up in the client by itself.

## Supported clients

`scenery mcp setup` looks for these clients on your computer and connects each one it finds:

- Claude Code
- Claude Desktop
- Cursor
- Windsurf
- VS Code
- Gemini CLI
- Antigravity
- Codex CLI

The steps below use Claude Code. The other clients follow the same first two steps, and then you restart the client.

## Connect Claude Code

1. Make sure you have [installed Scenery](/employees/install/) and paired your laptop.

2. In a terminal, run:

   ```bash
   scenery mcp setup
   ```

   Expected: a line for each client it found, such as **Claude Code: wrote scenery MCP entry**. A client that was already connected is reported as skipped. That is fine.

3. Restart Claude Code.

   Expected: Scenery is listed when you open `/mcp`.

4. If Claude Code asks you to sign in, open `/mcp`, choose **scenery**, then choose **Authenticate**.

   Expected: your browser opens, you sign in to Scenery if needed, and Claude Code shows scenery as connected.

You only do this once. Add or remove tools later from the portal, not from the terminal.

## Connect Cursor and other clients

1. Run `scenery mcp setup` as above. It adds Scenery to every supported client it finds.
2. Restart the client.

Expected: Scenery appears in the client's list of MCP servers. If a client is not found, install and open it once, then run `scenery mcp setup` again.

## Preview before changing anything

```bash
scenery mcp setup --dry-run
```

Expected: Scenery shows the clients it detected and a preview of the entry, and changes nothing.

## Use a new tool right away

After you install a tool in the portal, type `/reload-skills` in Claude Code to use it straight away. Otherwise it appears the next time the client starts.

## If something is off

- Run `scenery doctor` and check the daemon status shows running.
- Run `scenery mcp setup` again. It is safe to repeat.
- See [Troubleshooting](/rollout/troubleshooting/).

## Next

- [Find and install tools](/employees/find-and-install-tools/)

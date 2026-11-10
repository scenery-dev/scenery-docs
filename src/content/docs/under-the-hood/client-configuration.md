---
title: "How AI clients get configured"
description: "How Claude Code, Cursor and others are connected."
sidebar:
  order: 4
---

AI clients learn about Scenery through their own MCP settings. `scenery mcp setup` adds Scenery to each supported client it finds on the laptop. After that, tools you install in the portal appear in the client without more setup.

## Supported clients

Claude Code, Claude Desktop, Cursor, Windsurf, VS Code, Gemini CLI, Antigravity and Codex CLI.

## Careful with your settings

- Setup changes only what Scenery needs and keeps the rest of the file, including your formatting.
- It makes a backup before changing a client's settings.
- `scenery mcp setup --dry-run` shows what it would do and changes nothing.
- Setup is safe to run again.
- `scenery uninstall` removes Scenery's entries and puts back what was there, without overwriting your later edits.

For the steps, see [Connect your AI client](/employees/connect-your-ai-client/).

## Related

- [Daemon and shim](/under-the-hood/daemon-and-shim/)
- [Uninstalling restores, not deletes](/concepts/uninstalling/)

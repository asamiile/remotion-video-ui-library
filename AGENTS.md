# AGENTS.md

Guide for AI agents working in this repository.

- Read these first:
	- [.agents/rules/repository.md](.agents/rules/repository.md) - repository structure, file layout, and core conventions
	- [.agents/rules/composition-update-runbook.md](.agents/rules/composition-update-runbook.md) - how to add or update compositions and render coverage
	- [.agents/rules/config-local-layout.md](.agents/rules/config-local-layout.md) - how `config/local` is wired and what belongs in `*.example.json` vs `*.local.json`
	- [.agents/rules/composition-text-local.md](.agents/rules/composition-text-local.md) - read-only policy for personal `composition-text.local.json` and the few exceptions
	- [.agents/rules/agent-tool-usage.md](.agents/rules/agent-tool-usage.md) - token-efficient Read/Edit usage guidance for AI agents

## Overview

A Remotion-based video UI library. Text effects, Background, Effects, and other compositions are previewed in Remotion Studio and exported via `render.sh` to MP4, transparent-background ProRes, etc. It's a personal video-production toolkit, not something published as an npm package.

## Commands

For specific commands (starting the preview, rendering, upgrading Remotion), see [README.md](README.md).

## Configuration

- Project rules: [.agents/rules/](.agents/rules/)
- Skills: [.agents/skills/](.agents/skills/)

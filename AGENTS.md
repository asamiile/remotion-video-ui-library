# AGENTS.md

Guide for AI agents working in this repository.

This file is the agent-neutral source of truth for GitHub Copilot, OpenAI Codex, and Claude Code. Product-specific instruction files should only point here or add narrowly product-specific integration notes; do not duplicate repository rules across them.

- Read these first:
	- [.agents/rules/repository.md](.agents/rules/repository.md) - repository structure, file layout, and core conventions
	- [.agents/rules/composition-schema-unification.md](.agents/rules/composition-schema-unification.md) - standard .schema.ts file structure (schema + defaults + types unified in one file)
	- [.agents/rules/composition-update-runbook.md](.agents/rules/composition-update-runbook.md) - how to add or update compositions and render coverage
	- [.agents/rules/rendering.md](.agents/rules/rendering.md) - rendering duration, formats, output layout, and verification rules
	- [.agents/rules/config-local-layout.md](.agents/rules/config-local-layout.md) - how `config/local` is wired and what belongs in `*.example.json` vs `*.local.json`
	- [.agents/rules/composition-text-local.md](.agents/rules/composition-text-local.md) - read-only policy for personal `composition-text.local.json` and the few exceptions
	- [.agents/rules/agent-tool-usage.md](.agents/rules/agent-tool-usage.md) - token-efficient Read/Edit usage guidance for AI agents
	- [.agents/design/README.md](.agents/design/README.md) - design pattern specs (gradient, marble, halftone, infographics): approved looks, palettes, color roles, what to avoid; read the matching file before building or restyling that look
	- [.loop/policies/remotion-composition.md](.loop/policies/remotion-composition.md) - autonomous-loop boundaries and human approval gates

## Language

- Write all repository content in English: code, comments, docs, rules, skills, templates, commit messages, and PR descriptions. Do not add Japanese text.
- Exception: sample copy that exists to test Japanese typesetting (`*Jp` / `jp*` entries and ruby patterns in `config/local/composition-text.example.json`) stays in Japanese. See [.agents/rules/repository.md](.agents/rules/repository.md#development-notes).
- Replying to the user in chat may follow the user's language; this rule covers files in the repository.

## Overview

A Remotion-based video UI library. Text effects, Background, Effects, and other compositions are previewed in Remotion Studio and exported via `render.sh` to MP4, transparent-background ProRes, etc. It's a personal video-production toolkit, not something published as an npm package.

## Commands

For specific commands (starting the preview, rendering, upgrading Remotion), see [README.md](README.md).

## Configuration

- Project rules: [.agents/rules/](.agents/rules/)
- Design patterns: [.agents/design/](.agents/design/)
- Skills: [.agents/skills/](.agents/skills/)
- Autonomous goals and runtime: [.loop/README.md](.loop/README.md)

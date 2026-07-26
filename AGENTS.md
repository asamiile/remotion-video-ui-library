# AGENTS.md

Guide for AI agents working in this repository.

- Repository structure & development rules: [.agents/repository.md](.agents/repository.md)

## Overview

A Remotion-based video UI library. Text effects (Neon / Glitch / LED, etc.), loading icons, audio spectrums, map animations, and other compositions are previewed in Remotion Studio and exported via `render.sh` to MP4, transparent-background ProRes, etc. It's a personal video-production toolkit, not something published as an npm package.

## Commands

For specific commands (starting the preview, rendering, upgrading Remotion), see [README.md](README.md).

## Cursor configuration

- Project rules: [.cursor/rules/](.cursor/rules/) (`.mdc`)
- Skills: [.cursor/skills/](.cursor/skills/)
- These are paths Cursor auto-detects relative to the repository root, so **do not move them under `.agents/`**.

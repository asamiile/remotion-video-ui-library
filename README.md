# Remotion Video UI Library

A Remotion-based video UI library.

## Commands

**Install Dependencies**

```console
pnpm i
```

**Start Preview** (Remotion Studio)

```console
pnpm run dev
```

**Render**

```console
sh render.sh [subcommand]
sh render.sh --transparent-bg NeonText-LchikaOrangeJp   # e.g. no backdrop color (transparent)
sh render.sh --with-canvas-bg AudioSpectrum   # e.g. bake in the preview backdrop when exporting
sh render.sh --png-sequence CodeStreamVertical # PNG sequence instead of the default MP4
sh render.sh --adobe-stock-alpha LoadingIcon-Default # transparent ProRes 4444 MOV
sh render.sh --adobe-stock Background-CodeNoiseWall-AmberGlow # 60-second ProRes 422 HQ MOV
```

| Subcommand (batch) | Description |
|--------------|------|
| `Intro` | `Intro` → `out/Intro/Intro.mp4` |
| `LoadingIcon` | All patterns (Default … CustomWithText, etc.) |
| `Location` | The location list is kept in sync with `composition-text` and `scripts/list-location-composition-ids.cjs` |
| `MiniMap` | Each location (requires **WebGL** / `--gl=angle`) |
| `AudioSpectrum` | Simple / Detailed (pattern, `--mute-audio`) |
| `all` | Runs all of the above in order (**default**) |

| Option | Description |
|------------|------|
| `--transparent-bg` | `REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1`. Makes supported composition backdrops transparent. Intended for PNG sequence output and can be combined with `--with-canvas-bg` |
| `--with-canvas-bg` | If omitted, `render.sh` fixes `REMOTION_CANVAS_BACKGROUND=0` (the preview backdrop is not baked in). Only when passed does the [`composition-canvas-preview.ts`](./src/config/composition-canvas-preview.ts) layer get reflected in the render. Distinct from each composition's own `backgroundColor` |
| `--png-sequence` | Export PNG frames under `out/<Studio Folder>/<CompositionId>/png/` instead of MP4 |
| `--adobe-stock-alpha` | Export a transparent, silent ProRes 4444 MOV; enables Adobe Stock duration overrides |
| `--adobe-stock` | Export a silent ProRes 422 HQ MOV; selected background families are extended to 60 seconds |

The default export is H.264 MP4. Output folders mirror the `<Folder>` hierarchy shown in Remotion Studio.

See the header comment in `render.sh` for details.

## Autonomous engineering loop

The repository includes a bounded agent loop for goal-driven implementation, independent verification, persistent evidence, and explicit stopping conditions.

```console
cp .loop/goal.example.json .loop/active-goal.json
pnpm loop:validate -- .loop/active-goal.json
pnpm loop:verify -- --goal .loop/active-goal.json
pnpm loop:run -- --agent codex --goal .loop/active-goal.json
# Or use: --agent claude / --agent copilot
```

The same goal and verification contract works with Codex CLI, Claude Code, and GitHub Copilot CLI. See [`.loop/README.md`](./.loop/README.md) before unattended use. Full renders, deletion, Git delivery, publication, and external writes remain human approval gates.

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Author

[Asami.K](https://asami.tokyo/)

## Licence

[MIT](https://opensource.org/licenses/MIT)

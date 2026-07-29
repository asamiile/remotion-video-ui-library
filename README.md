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

**Render video**

```console
sh render.sh [subcommand]
sh render.sh --transparent-bg NeonText-LchikaOrangeJp   # e.g. no backdrop color (transparent)
sh render.sh --with-canvas-bg AudioSpectrum   # e.g. bake in the preview backdrop when exporting
```

| Subcommand (batch) | Description |
|--------------|------|
| `Intro` | `Intro` → `Intro.mov` |
| `LoadingIcon` | All patterns (Default … CustomWithText, etc.) |
| `Location` | The location list is kept in sync with `composition-text` and `scripts/list-location-composition-ids.cjs` |
| `MiniMap` | Each location (requires **WebGL** / `--gl=angle`) |
| `AudioSpectrum` | Simple / Detailed (pattern, `--mute-audio`) |
| `AudioSpectrumFiles` | One per file under `public/audio/AudioSpectrum/` |
| `all` | Runs all of the above in order (**default**) |

| Option | Description |
|------------|------|
| `--transparent-bg` | `REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1`. Sets the full-screen `backgroundColor` in Neon / Glitch etc. templates to `transparent` and disables the radial vignette (for alpha ProRes output). Can be combined with `--with-canvas-bg` |
| `--with-canvas-bg` | If omitted, `render.sh` fixes `REMOTION_CANVAS_BACKGROUND=0` (the preview backdrop is not baked in). Only when passed does the [`composition-canvas-preview.ts`](./src/config/composition-canvas-preview.ts) layer get reflected in the render. Distinct from each composition's own `backgroundColor` |

See the header comment in `render.sh` for details.

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Author

[Asami.K](https://asami.tokyo/)

## Licence

[MIT](https://opensource.org/licenses/MIT)

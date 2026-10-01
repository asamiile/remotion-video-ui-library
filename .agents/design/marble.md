---
name: marble
description: >-
  Design spec for marble looks: the MarbleFlow stone marble (veins,
  translucency, sway modes, water ripples) and how it differs from the soft
  Gradient `marble` style. Apply when creating or restyling marble patterns.
alwaysApply: false
---

# Marble

Two marble looks exist. Pick by the feel you want:

| | MarbleFlow | Gradient `marble` style |
|---|---|---|
| Feel | Polished stone, depth, glossy veins | Soft paint combed on water, no lines |
| Where | `src/Background/MarbleFlow/` | `src/Background/Gradient/` (see [gradient.md](./gradient.md)) |
| IDs | `Background-MarbleFlow-<Pattern>` | `Background-Gradient-<palette>Marble` |
| Palettes | Its own stone palettes (below) | The shared `gradientPalettes` |

## MarbleFlow

Domain warping (`fbm(p + fbm(p + fbm(p)))`) makes the flowing stone; the warp vectors pick colors, and thin glossy veins follow the final value.

| Prop | Role |
|---|---|
| `colorA` / `colorB` | Dense band / light band |
| `colorC` | Swirl accent and highlight tint |
| `flowMode` | `drift` (churning in place), `swirl` (turns with a twisting core), `wave` (silky side-to-side sway), `pulse` (breathes in and out) |
| `warp` | Swirl tightness; ~3 soft, 4 default, 5–6 turbulent |
| `veinDensity` | Number of veins; 0 = none |
| `clarity` | Translucency: lifts dark bands, shows a soft deeper layer, softens veins. **0.7 is the approved default**; 0.45 for dark stone so it does not turn grey |
| `ripple` / `rippleSources` / `rippleSpeed` | Water-surface rings bending the marble; 1 source = centered pond, 2–4 = scattered rain |

Approved patterns (`marbleFlowPatterns`):

| Group | Patterns |
|---|---|
| Color | `ocean`, `sunset`, `malachite`, `obsidianGold`, `carrara`, `sakura`, `lava` |
| Motion | `amethystSwirl` (swirl), `silkWave` (wave), `amberPulse` (pulse) |
| Ripple | `pondRipple`, `rainRipple` |

## Avoid (rejected in review)

- **Ink-drop / suminagashi effects** on MarbleFlow (spreading ink rings with flat circles). They were built and removed.
- **Opaque, heavy stone** with `clarity` 0: the translucent look was preferred.
- **White marble relying on veins** (`carrara`): veins are drawn as highlights, so they disappear on white; give white stone a darker `colorA`.

## Adding a pattern

Add an entry to `marbleFlowPatterns` starting from `...plainMarble`, check stills at a few frames, then run `npm run lint`, `./render.sh check`, and `git diff --check`.

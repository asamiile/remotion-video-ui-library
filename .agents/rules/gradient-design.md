---
name: gradient-design
description: >-
  Design spec for the modern gradient backgrounds (GradientFlow mesh and
  linear styles): look, color roles, approved palettes, parameter ranges,
  things to avoid, and how to add or reuse a gradient. Apply when creating or
  restyling gradient backgrounds or picking colors for a modern, clean look.
alwaysApply: false
---

# Gradient Design

The approved "modern, stylish" gradient look for this repository. The implementation lives in `src/Background/GradientFlow/`:

| File | Role |
|---|---|
| `gradient-flow.schema.ts` | Props schema and every pattern. **Canonical source for exact values**; the tables below summarize them. |
| `gradient-flow.glsl.ts` | Fragment shader: `waves`, `mesh`, `linear`, `marble`, `scoop` styles, contrast, vignette, grain |
| `GradientFlowTemplate.tsx` | Maps props to uniforms via `ShaderBackgroundLayer` |

Composition IDs are `Background-GradientFlow-<PatternKey>`. In Studio, `*Linear` patterns sit in `Background/GradientFlow/Linear` `*Marble` patterns sit in `Background/GradientFlow/Marble`, and `*Scoop` patterns sit in `Background/GradientFlow/Scoop`; everything else sits directly in `Background/GradientFlow`.

## The look

- Bright, airy pastels with one deeper tone for depth. Light overall; no dark edges.
- Soft, blurred color transitions. No hard edges, no drawn lines, no outlines.
- Slow, calm motion. Every animation loops seamlessly over the composition (20 s by default).
- A faint film grain (`grain` 0.12–0.35) for a printed, tactile finish.
- Visual references: OpenAI article cover art (soft motion-blurred light streaks in pastel blues, lilacs, mints and pinks).

## Styles

### `mesh`: mesh-gradient wallpaper

Four soft Gaussian blobs orbit on looping Lissajous paths over a base color and are blended as a weighted average.

| Prop | Role |
|---|---|
| `colorA` | Base / background tone (usually the lightest) |
| `colorB` | Main blob color (usually the deepest tone) |
| `colorC` | Accent blob (lime, lavender, ice blue, ...) |
| `contrast` | 0 = very soft. 0.3–0.45 = the approved default. Higher crisps the blob edges |
| `vignette` | 0 for pastel palettes |

### `linear`: motion-blurred light streaks

A linear color ramp across a gently bending diagonal, broken up by noise stretched about 10x along the streak direction, plus one accent band and pale white sheen streaks. It must read as blurred light, never as stripes or lines.

| Prop | Role |
|---|---|
| `colorA` → `colorB` | The linear ramp across the streaks (deeper → lighter) |
| `colorC` | Accent streak (lime, soft green, lavender glow, yellow, ice blue) |
| `randomSeed` | Also picks the streak angle, so change it to vary the composition |
| `intensity` | Strength of accent and sheen (0.85–1) |
| `vignette` / `grain` | 0 / 0.12 |

### `marble`: soft paint marbling

Two levels of fbm domain warping fold the field, and soft cosine color bands follow the warped contours, like paint combed on water. Uses the same palettes as `linear` (`colorA`/`colorB` = deep/light, `colorC` = accent band). There are no veins or drawn lines; the only highlight is a wide, faint sheen on the lightest bands. `contrast` ~0.2, `grain` 0.12, `vignette` 0.

### `scoop`: ice cream

Inspired by ice-cream scoop photos. Everything is drawn in domain-warped space, so the parts fold together.

| Prop | Role |
|---|---|
| `colorA` | Cream base |
| `colorC` | Second flavor, shown as large soft two-tone areas (set it close to `colorA` for a single-flavor scoop) |
| `colorB` | Sauce ribbon: one broad band of steady width along a smooth swirl |
| `ribbon` | Ribbon width; 0 = none, ~0.5–1.6 |
| `specks` / `speckColor` | Amount and color of chunky chips or sprinkles |

A fine frozen, crystalline surface texture and a soft broad light are always on. Keep ribbons to one broad band; many thin contour lines read as drawn lines (rejected). Strawberry-type ribbons use a soft pink (`#e8607a`) rather than strong red.

### `waves`

Two slow sine waves bend a three-color gradient (`classic` pattern): `colorA` fills the troughs, `colorB` the middle and `colorC` the crests. Bolder, larger color fields than `mesh`.

## Approved palettes

Each palette family has matching mesh, linear and marble versions. For mesh, `colorA` is the light base. For linear and marble, `colorA`/`colorB` are deep/light.

| Palette | Deep | Light | Accent | Patterns |
|---|---|---|---|---|
| Aqua | `#1aa9c4` | `#7fe6d0` | `#d6f25a` | `aquaMesh`, `aquaLinear`, `aquaMarble` |
| Periwinkle | `#6d7cff` | `#b7a6ff` | `#e8e4ff` | `periwinkleMesh`, `periwinkleLinear`, `periwinkleMarble` |
| Mint | `#86d9ee` | `#cdf2ec` | `#9fe04c` | `mintMesh`, `mintLinear`, `mintMarble` |
| Sky | `#0a64d8` | `#6cb8ff` | `#d4ecff` | `skyMesh`, `skyLinear`, `skyMarble` |
| Blush | `#ff8fb1` | `#ffd3de` | `#ffe56b` | `blushLinear`, `blushMarble` |

Other approved palettes:

| Pattern | colorA (base) | colorB | colorC |
|---|---|---|---|
| `classic` (waves), `sunsetMarble` | `#8f86e8` dusk lavender | `#ffab9c` peach | `#ffd98a` soft gold |
| `peachMesh` | `#f6eee6` | `#c9b6f2` | `#ffb38a` |
| `sorbetMesh` | `#ffd6e0` | `#ff7aa2` | `#ffcf5c` |

Scoop palettes (`gradientFlowScoopPatterns`): mint chip, cookies and cream, strawberry ripple, matcha swirl, lemon sorbet, berry citrus, caramel swirl, lavender cocoa, bubblegum, soda float. See the schema for exact colors.

## Avoid (rejected in review)

- **Strong reds** (vermilion, ember orange-red) as a main or accent color.
- **Wavy drawn lines** or ribbons with a bright crest. If a "line" feel is wanted, use the `linear` streak style instead of drawing lines.
- **Drawn hairlines**, and reeded-glass bands with hard straight edges.
- **Dark, low-key palettes on black** (neon on black, noir) unless explicitly requested. They read as heavy rather than modern.
- **Strong vignettes** on pastel palettes.

## Adding a pattern

1. Add an entry to `gradientFlowPatterns` (mesh/waves), `gradientFlowLinearPatterns` (linear), `gradientFlowMarblePatterns` (marble) or `gradientFlowScoopPatterns` (scoop, start from `...scoopBase`) in `gradient-flow.schema.ts`, starting from `...base`.
2. Name the key `<palette>Mesh`, `<palette>Linear`, `<palette>Marble` or `<flavor>Scoop`. Linear, marble and scoop keys **must** end in `Linear` / `Marble` / `Scoop`: `render.sh` routes `Background-GradientFlow-*Linear`, `*Marble` and `*Scoop` to the matching `out/Background/GradientFlow/<Style>/` folder.
3. Prefer an approved palette. For a new palette, keep it light and airy with one deep tone, and add it to the table above.
4. Check stills at a few frames, then run `npm run lint`, `./render.sh check`, and `git diff --check`. See [Composition Update Runbook](./composition-update-runbook.md) and [Rendering](./rendering.md).

## Reusing the gradient elsewhere

- **As a background layer in another composition:** render `<GradientFlowTemplate {...gradientFlowLinearPatterns.aquaLinear} />` (or any pattern) underneath the other content. It fills its parent like `AbsoluteFill`.
- **To adapt one pattern:** spread it and override, e.g. `{ ...gradientFlowPatterns.aquaMesh, randomSeed: 3 }`.
- **For non-shader UI** (CSS gradients, text, accents): take colors from the palette table so the look stays consistent.

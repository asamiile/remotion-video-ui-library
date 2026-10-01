---
name: gradient
description: >-
  Design spec for the modern gradient backgrounds (Gradient waves, mesh,
  linear, marble and scoop styles): look, color roles, the approved palette
  list, parameter ranges,
  things to avoid, and how to add or reuse a gradient. Apply when creating or
  restyling gradient backgrounds or picking colors for a modern, clean look.
alwaysApply: false
---

# Gradient Design

The approved "modern, stylish" gradient look for this repository. The implementation lives in `src/Background/Gradient/`:

| File | Role |
|---|---|
| `gradient.schema.ts` | Props schema, the `gradientPalettes` list and every pattern. **Canonical source for exact values**; the tables below mirror them. |
| `gradient.glsl.ts` | Fragment shader: `waves`, `mesh`, `linear`, `marble`, `scoop` styles, contrast, vignette, grain |
| `GradientTemplate.tsx` | Maps props to uniforms via `ShaderBackgroundLayer` |

Composition IDs are `Background-Gradient-<palette><Style>` (e.g. `Background-Gradient-AquaMesh`). Each style has its own Studio subfolder and output folder: `Background/Gradient/{Waves,Mesh,Linear,Marble,Scoop}`.

`Background/Gradient` is the category for all gradient backgrounds. A new gradient look goes in as another style folder here (a new `style` in this shader, or a separate implementation that registers its own `<Folder>` under `Gradient`). Studio folders are limited to three levels, so `Background/Gradient/<Style>` is the deepest level; palettes are expressed in the ID (`<palette><Style>`), not as folders.

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
| `ribbon2` / `ribbon2Color` | Optional second, thinner ribbon on another swirl (0 = none, ~0.5) |

A fine frozen, crystalline surface texture and a soft broad light are always on. Keep each ribbon to one broad band; many thin contour lines read as drawn lines (rejected). Mix-ins are always flowing ribbons, never chips or sprinkle dots (rejected). Strawberry-type ribbons use a soft pink (`#e8607a`) rather than strong red.

### `waves`

Two slow sine waves bend the palette ramp: `colorA` (deep) fills the troughs, `colorB` (light) the middle and `colorC` (accent) the crests. Bolder, larger color fields than `mesh`. `contrast` 0.2, `grain` 0.15, `vignette` 0.

## Approved palettes

These eight palettes are defined once in `gradientPalettes` and every one of them exists in every style (`waves`, `mesh`, `linear`, `marble`), so there are 32 patterns named `<palette><Style>`.

| Palette | Deep | Light | Accent | Mood |
|---|---|---|---|---|
| `aqua` | `#1aa9c4` teal | `#7fe6d0` mint | `#d6f25a` lime | Fresh, clear water |
| `periwinkle` | `#6d7cff` periwinkle | `#b7a6ff` lilac | `#e8e4ff` pale lavender | Calm, techy |
| `mint` | `#86d9ee` aqua | `#cdf2ec` pale mint | `#9fe04c` soft green | Very light, airy |
| `sky` | `#0a64d8` azure | `#6cb8ff` sky | `#d4ecff` ice blue | Crisp, corporate blue |
| `blush` | `#ff8fb1` rose | `#ffd3de` blush | `#ffe56b` butter yellow | Sweet, playful |
| `sunset` | `#8f86e8` dusk lavender | `#ffab9c` peach | `#ffd98a` soft gold | Warm dusk |
| `peach` | `#c9b6f2` lilac | `#f6eee6` ivory | `#ffb38a` peach | Soft, neutral, editorial |
| `sorbet` | `#ff7aa2` pink | `#ffd6e0` pale pink | `#ffcf5c` tangerine-yellow | Bright, summery |

How the tones map to colors per style:

| Style | colorA | colorB | colorC |
|---|---|---|---|
| `mesh` (`meshColors`) | light (base) | deep | accent |
| `waves`, `linear`, `marble` (`rampColors`) | deep | light | accent |

### Scoop palettes

`scoop` uses flavor-specific colors instead of the shared palettes (`gradientScoopPatterns`):

| Pattern | colorA (cream) | colorB (ribbon) | colorC (second flavor) | ribbon2Color |
|---|---|---|---|---|
| `mintChipScoop` | `#a9e5cc` | `#3a2a25` chocolate | `#bdeed8` | — |
| `cookiesCreamScoop` | `#f4eddf` | `#2f2825` cookie | `#ece4d3` | — |
| `strawberryRippleScoop` | `#fbf1e4` | `#e8607a` | `#f9d9d8` | — |
| `matchaSwirlScoop` | `#f5f1e1` | `#7fa94e` | `#a6c777` | — |
| `lemonSorbetScoop` | `#fbf8ee` | `#c9df6a` | `#f1e15a` | — |
| `berryCitrusScoop` | `#fbf4f1` | `#c7356f` | `#ffb24f` | — |
| `caramelSwirlScoop` | `#f3ead9` | `#a77d57` | `#c39d77` | — |
| `lavenderCocoaScoop` | `#a58bd8` | `#3f2f2e` | `#9479cc` | `#f6c84a` candy yellow |
| `bubblegumScoop` | `#f8c9d4` | `#fbe3b5` | `#f4b2c2` | `#45a85c` green |
| `sodaFloatScoop` | `#6cc0ea` | `#3d2c29` | `#82cbef` | `#d9536a` berry |

## Avoid (rejected in review)

- **Strong reds** (vermilion, ember orange-red) as a main or accent color.
- **Wavy drawn lines** or ribbons with a bright crest. If a "line" feel is wanted, use the `linear` streak style instead of drawing lines.
- **Drawn hairlines**, and reeded-glass bands with hard straight edges.
- **Dark, low-key palettes on black** (neon on black, noir) unless explicitly requested. They read as heavy rather than modern.
- **Strong vignettes** on pastel palettes.

## Adding a pattern

1. **New palette:** add `{ deep, light, accent }` to `gradientPalettes`, then add one entry per style to `gradientWavesPatterns`, `gradientMeshPatterns`, `gradientLinearPatterns` and `gradientMarblePatterns` using `...wavesBase` / `...meshBase` / `...linearBase` / `...marbleBase` with `...rampColors(P.x)` or `...meshColors(P.x)`. Keep it light and airy with one deep tone, and add it to the palette table above.
2. **New scoop:** add an entry to `gradientScoopPatterns` starting from `...scoopBase`.
3. Keys **must** end in the style name (`Waves`, `Mesh`, `Linear`, `Marble`, `Scoop`): `render.sh` routes `Background-Gradient-*<Style>` to `out/Background/Gradient/<Style>/`.
4. Check stills at a few frames, then run `npm run lint`, `./render.sh check`, and `git diff --check`. See [Composition Update Runbook](../rules/composition-update-runbook.md) and [Rendering](../rules/rendering.md).

## Reusing the gradient elsewhere

- **As a background layer in another composition:** render `<GradientTemplate {...gradientLinearPatterns.aquaLinear} />` (or any pattern) underneath the other content. It fills its parent like `AbsoluteFill`.
- **To adapt one pattern:** spread it and override, e.g. `{ ...gradientMeshPatterns.aquaMesh, randomSeed: 3 }`.
- **For non-shader UI** (CSS gradients, text, accents): import `gradientPalettes` from `gradient.schema.ts` (e.g. `gradientPalettes.aqua.deep`) instead of copying hex values, so the look stays consistent.

# Repository Structure

## Directory Layout (Overview)

```
/src
  Root.tsx              … Registers every composition (Composition ID, schema, defaultProps)
  <standalone feature>/  … Intro, Map, Audio, Placeholder, etc.
  Text/                  … Category for text effects (LedText, NeonText, GlitchText, etc.)
  Loading/                … Category for loading indicators
  Effect/                … Category for scene-transition / production effects (GlitchTransitionBridge, etc.)
  Background/            … Category for ambient decoration parts layered over video backgrounds
  OneTake/                … OneTake-brand-specific assets (Onboarding / Logo)
  composition/            … Shared composition infrastructure (see below)
  config/                … Preview-canvas backdrop settings
  helpers/                … Shared utilities: font loading, ms→frame conversion, etc.
/config/local/          … composition-text content (see "Development notes" below)
/scripts                … Composition ID enumeration for render.sh (reads *-config.ts via AST)
/loaders                … Webpack loaders (injects config/local content)
/public                 … Static assets (audio, images, etc.)
render.sh                … Batch rendering script (see README.md for details)
remotion.config.ts        … Build configuration
```

**Core principle**: the directory hierarchy under `src/` must always match `Root.tsx`'s `<Folder>` nesting exactly. Looking at Studio's sidebar (Compositions panel) should tell you the corresponding `src/` path directly.

## Structure of a Single Composition

The leaf of each feature folder normally contains three files (no version suffix folder needed).

```
<Feature>/
  <Feature>Template.tsx     … The Remotion component itself
  <feature>.schema.ts       … zod prop type definitions
  <feature>.config.ts       … defaultProps and `*Patterns` (canonical default copy / look)
```

Version information is preserved in **type names** (`CodeStreamTemplateV1`, `ledTextV1Patterns`), not folder names, to reduce visual clutter in the IDE hierarchy. When adding or refactoring a composition, keep the responsibilities split across `Template`, `schema`, and `config` files instead of inlining defaults or prop types into `Root.tsx`.

## The Four Places Under `src/`

When adding a new composition, decide where to put the `<Feature>/` folder using the following criteria (version info stays in type names, not folder structure).

| Location | Criteria | Current examples |
|---|---|---|
| `src/<Feature>/` (top-level) | A standalone feature with no planned siblings | `Intro/`, `Map/`, `Audio/`, `Placeholder/` |
| `src/<Category>/<Feature>/` | One member of a category bundling multiple variations of the same role | `Text/LedText/`, `Text/NeonText/`, `Effect/GlitchTransitionBridge/` |
| `src/<Category>/<Feature>/` (flat) | A category member with a single composition (no pattern family), or a category whose members are always browsed flat in Studio | `Background/AmbientBlurOrbs/`, `Background/ScanLine/`, `Text/FlickerTitle/` |
| `src/<ClientName>/<Role>/<Feature>/` | A full set of brand assets specific to one client/product | `OneTake/Onboarding/`, `OneTake/Logo/` |
| `src/composition/`, `src/config/`, `src/helpers/` | Shared infrastructure not tied to a specific composition | Font loaders, preview backdrop settings, etc. |

How to decide when it's unclear:

- **Ask first: "does this belong to an existing category (`Text`/`Loading`/`Effect`/`Background`)?"** A variation on text look/animation goes in `Text/`, a loading expression goes in `Loading/`, a scene-transition/production effect goes in `Effect/`, and an ambient decoration layered over a video background goes in `Background/`.
- **If a new role emerges that doesn't fit any existing category**, it's fine to create a new category folder (`Text/` and `Effect/` themselves started as single-feature standalone folders and were promoted to categories once a second member showed up). Promoting to a category early is clearer than letting a standalone folder accumulate 2-3 features.
- **A folder named after a specific client (e.g. OneTake) should only hold that brand's dedicated assets.** If something you build turns out to be generally reusable, put it in the generic category even if the client project was the original trigger (e.g. the flicker-on effect from the OneTakeLogo composition was generalized and placed in `Text/FlickerTitle/`, not `OneTake/`. Similarly, the video-background decoration parts that originally lived in `OneTake/Background/` were promoted to a top-level `Background/`, since they're generally usable rather than OneTake-specific).
- Whenever you create a new category or client folder, **make sure `Root.tsx`'s `<Folder>` nesting matches it exactly**. Never leave the two out of sync by updating only one side. This also governs whether a feature gets its own middle folder: if `Root.tsx` wraps it in a per-feature `<Folder>` (because Studio browsability benefits from grouping its pattern variants), `src/` uses the nested structure `<Category>/<Feature>/`; if the composition(s) sit directly under the category's `<Folder>` with no per-feature sub-`<Folder>` (as in `Background/`, or a single-composition feature like `FlickerTitle/`), `src/` stays flat at `<Category>/<Feature>/`. `Background/` established the flat convention because none of its parts have enough pattern variants to warrant per-feature grouping in Studio; `Text/` mostly uses the nested convention because most of its families do.
- **Keep category names short and singular** (`Text`, `Effect`, `Background`). Only keep the original name where an abbreviation would be confusing (e.g. `AudioSpectrum` was shortened to `Audio`, and `PlaceholderImage` to `Placeholder`). Folder names follow this same convention—no version suffix in folder structure, only in type names.

## Development Notes

- **Do not use copyright-related notices or markings**, including copyright statements, © symbols, or attribution lines.
- **Do not reference external sources in code**, such as comments indicating which video, article, tutorial, or project the composition was based on. Keep code self-contained without external attribution.
- **`config/local/*.local.json` is for personal, uncommitted, per-user settings.** See [.agents/rules/composition-text-local.md](../.agents/rules/composition-text-local.md) for the read-only policy and the narrow exception.
- **`config/local/*.local.json` is for personal, uncommitted, per-user settings.** Agents must treat these as read-only unless the user explicitly names a local target path and asks for that change in chat. Sample copy lives in `config/local/composition-text.example.json`; edit the committed types/merge logic under `src/composition/` instead. See [.agents/rules/composition-text-local.md](../.agents/rules/composition-text-local.md) for details.
- **The procedure for adding a new composition/pattern** (adding to an existing family / adding a new family / the location, LoadingIcon, and AudioSpectrum enumeration mechanics) follows the runbook at [.agents/rules/composition-update-runbook.mdc](../.agents/rules/composition-update-runbook.mdc).
- **The layout of `config/local` and how it's injected at build time** (`remotion.config.ts` reads `composition-text.local.json` and injects it as `__COMPOSITION_TEXT_LOCAL__`) is documented in [.agents/config-local-layout/SKILL.md](../.agents/config-local-layout/SKILL.md).
- **The contents of `src/composition/` are "shared infrastructure"**, distinct from the "feature categories" like `src/Text/` (the similar naming is easy to confuse). It is not a place to add individual compositions.
- **Never move `.cursor/rules/` or `.agents/skills/` under `.agents/`.** These are fixed, repo-root-relative paths that the Cursor editor auto-detects — not a naming convention specific to this repository. Moving them would break rule/skill loading for anyone using Cursor.

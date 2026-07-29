---
name: config-local-layout
description: >-
  Uses config/local/composition-text.example.json (committed) and
  composition-text.local.json (gitignored) to override composition copy at
  bundle time via webpack DefinePlugin. Source TS configs keep sample strings
  only. Use when adding render copy, local JSON, or restructuring config/local.
---

# config/local (composition copy)

## Policy

- **Config in the repo** (`*-config.ts` / schema defaults) holds **sample copy only**.
- **Production / personal copy** goes in **`config/local/composition-text.local.json`** (gitignored). Create it by copying `composition-text.example.json`.
- **`remotion.config.ts`** reads `composition-text.local.json` at the start of the build and injects it into webpack as `__COMPOSITION_TEXT_LOCAL__`. If the file doesn't exist, it injects `{}`.
- Merging happens in **`src/composition/composition-merged.ts`**, which `Root.tsx` / `MiniMapTemplate` reference.

## JSON Keys (all optional)

| Key | Content |
|------|------|
| `intro` | `authorName`, `introTitle`, `introDescription` |
| `ledTextPatterns` | pattern ID → partial props (e.g. `text`) |
| `neonTextPatterns` | same |
| `loadingIconPatterns` | same |
| `codeStreamPatterns` | same, but split between horizontal/vertical presets and `paragraphs` arrays |
| `location` | `locationId` → `{ "locationName" }` |
| `mapLocationPoints` | `locationId` → `{ "name" }` |

## For Agents

1. When adding "override copy" for a new composition, add the key to **`composition-text.example.json`** and update the **`src/composition/composition-text-local.ts`** type. Add merge logic in **`src/composition/composition-merged.ts`** if needed.
2. `CodeStream` is defined in **`codeStreamPatterns`** and should be split into separate horizontal/vertical entries with `paragraphs` arrays so each composition can advance paragraph-by-paragraph.
3. Keep this file focused on `config/local` wiring and the example/local split; use [.agents/rules/composition-text-local.md](./composition-text-local.md) for the personal-file policy.
4. Make sure `config/local/*.local.json` is listed in `.gitignore`.

## Overriding a Single Composition via the CLI

Separately from the merged JSON, you can also pass just that composition's props via `--props` (see the Remotion docs).

---
description: Procedure for updating compositions, composition-text, and render.sh (a runbook shared by humans and agents)
alwaysApply: false
---

# Composition Update Runbook

## Terminology

- **Pattern**: multiple variations of the same template (e.g. `pinkPulse` / `pinkPulseJp`). In `Root.tsx`, `*-${capPattern(id)}` becomes the composition ID.
- **Canonical copy (structure)**: the keys of the `*Patterns` object in `src/**/<Name>/<ComponentName>.schema.ts`. Keys not present here cannot be added via `composition-text.local.json` alone (`shallowMergePatternRecord` only overwrites existing keys).
- **Copy overrides**: `config/local/composition-text.local.json` (personal, gitignored by convention). The read-only policy and the only exception live in [.agents/rules/composition-text-local.md](./composition-text-local.md).

## A. Adding one pattern to an existing family (LED / Neon / Glitch, etc.)

1. Add an entry to `*Patterns` in **`src/<Feature>/<ComponentName>/<component-name>.schema.ts`** (this is the canonical source for default copy and look).
   Text-effect families (LED/Neon/Glitch, etc.) live under `src/Text/<Feature>/<ComponentName>/…`, and LoadingIcon lives under `src/Loading/LoadingIcon/…` (the directory hierarchy matches `Root.tsx`'s `<Folder>` nesting). See [.agents/rules/repository.md](../../.agents/rules/repository.md) for the criteria on where to place directories.
2. Add the same pattern-ID block to **`config/local/composition-text.example.json`** (sample copy, for documentation). Keep key names consistent with the config.
3. If it needs to be reflected in types, add the key to the corresponding `*Patterns` type in **`src/composition/composition-text-local.ts`** (keeps types consistent for agents).
4. **Agents must never edit `config/local/composition-text.local.json`** on their own (it's the user's personal file). See [.agents/rules/composition-text-local.md](./composition-text-local.md) for the narrow exception.
5. **Leave `render.sh` alone in general.** `scripts/list-text-composition-ids.cjs` (and similar scripts) read `*-schema.ts` via AST, so ID enumeration follows automatically.
6. Composition IDs must match **`Root.tsx`'s naming**. (Rainbow is the one exception: `NeonText-Rainbow` + `capPattern`, concatenated without a hyphen.)

## B. Adding a new "family" (a new group of `<Composition>-*`)

1. Add the template, schema, and `**-schema.ts**` (`*Patterns`).
2. **Add the family to `scripts/generate-composition-merged.cjs`** (the `families` array). Then regenerate:
   ```bash
   npm run generate:merged-composition
   ```
   This auto-generates `src/composition/composition-merged.ts` instead of hand-editing it. If you need a custom `localName` (e.g. `randomLinesPatterns` export but `randomLinesBackgroundPatterns` local override), pass it in the family definition: `{ type: "pattern", ..., localName: "customNamePatterns" }`. Check the generated output to ensure it matches the canonical source and types.
3. Add the JSON key type to **`src/composition/composition-text-local.ts`**.
4. Register `<Composition>-*` in **`src/Root.tsx`** via `Object.entries(merged*Patterns).map` (`withCanvasPreview` / duration / schema / defaultProps).
5. Add a `*Patterns` block to **`config/local/composition-text.example.json`**.
6. If the family is `CodeStream`, define separate `horizontal` and `vertical` entries under `codeStreamPatterns`, and use a `paragraphs` array so paragraph 1 / paragraph 2 can advance one loop at a time.
7. **For batch export**: add `{ idPrefix, file, exportName, join? }` to `families` in `scripts/list-text-composition-ids.cjs` (use `join: ""` for a Rainbow-style ID).
8. **Never skip wiring up `render.sh`**: add a `render_<family>()` function, and always wire it into both the `case` in `main()` and `all` (adding a dedicated subcommand is optional, but never leave a family that `all` can't export). Prefer an AST-enumeration script (`scripts/list-<family>-composition-ids.cjs`, following the `families` array pattern in `scripts/list-text-composition-ids.cjs` or `scripts/list-background-composition-ids.cjs`) over a hand-typed ID array whenever the family has a `*Patterns` record — a hand-typed array is another copy of the same information that can silently drift from `Root.tsx`. A fixed array (like `TEXT_EFFECTS_JP_SAMPLE_IDS`, a deliberately curated subset) is still fine for cases with no pattern family to enumerate, or where the list is intentionally partial.
   - **Real incident**: when two OneTake compositions were added, this step was skipped, and they went unnoticed as unexportable from any `render.sh` subcommand.
   - When adding/changing a family that's "filtered by a registration condition" tied to a location or coordinates (e.g. MiniMap only includes locations in `mapLocationPoints` that have both latitude and longitude set), the enumeration script must exactly match `Root.tsx`'s actual registration condition. Reusing another family's enumeration result (e.g. the full location list used for `Location`) will attempt to render composition IDs that don't exist and fail.
   - **Real incident**: `render_minimap` was reusing the same location list as `render_location`, so it failed with `Error: Could not find composition with ID ...` for locations without lat/lng set (fixed by creating a dedicated `scripts/list-minimap-composition-ids.cjs`).
   - **`render.sh`'s `resolve_output_subdir()` is a separate hand-maintained mapping** (composition ID prefix → `out/` subdirectory) that must also stay in sync with `Root.tsx`'s `<Folder>` nesting — a third place that can drift independently of both `Root.tsx` and the enumeration scripts. After adding or renaming a family, add a case to `resolve_output_subdir()`, then run **`./render.sh check`** to verify every composition ID the enumeration scripts (plus the small fixed-ID list inside `check_output_dirs()`) produce actually resolves to a non-empty subdirectory. This won't catch a family missing from `render.sh` entirely (that has no enumeration output to check) — it only catches an ID that's enumerated somewhere but has no output-directory mapping.

## C. Locations (Location / MiniMap)

1. Add the location ID and `locationName` under **`location`** in both **`composition-text.example.json`** (committed) and the user's own **`composition-text.local.json`**.
2. **For MiniMap**, define the same ID's latitude/longitude etc. in **`mapLocationPoints`**. Only IDs with both fields set make it into `mergedMapLocationPoints`.
3. **`render.sh`'s Location** subcommand enumerates `location` keys via `scripts/list-location-composition-ids.cjs` (local takes priority; see the script's header comment for the spec). **MiniMap** does not reuse that same key list — it uses `scripts/list-minimap-composition-ids.cjs`, which is already filtered down to locations with both lat/lng set.

## D. LoadingIcon / AudioSpectrum (render enumeration)

- **LoadingIcon**: `scripts/list-loading-icon-composition-ids.cjs` → `loadingIconPatterns` in `loading-icon-schema.ts`.
- **AudioSpectrum presets**: `scripts/list-audiospectrum-pattern-composition-ids.cjs` → `audioSpectrumPatterns`.
- **AudioSpectrum per-file**: `scripts/list-audiospectrum-file-composition-ids.cjs` → the `id`s in `audioSpectrumAudioFiles` (not a directory scan).

## E. Locale Conventions for Copy (text-family patterns)

- Patterns whose key **ends in `*Jp`**: Japanese sample copy is fine.
- **All other** patterns: default copy should be **English** (keep `composition-text.example.json` and `*-schema.ts` in sync).

## F. Rendering With a Transparent Backdrop (isolating causes)

- **Preview canvas** (`composition-canvas-preview.ts`): controlled by `REMOTION_CANVAS_BACKGROUND` / `--with-canvas-bg`.
- **A composition's own design color** (e.g. Neon's `lchikaOrangeBase.backgroundColor`): the template's `<AbsoluteFill style={{ backgroundColor }}>`. This is made transparent by `--transparent-bg` (`REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1`).

## G. Local Verification Commands (reference)

```bash
node scripts/list-text-composition-ids.cjs
node scripts/list-loading-icon-composition-ids.cjs
node scripts/list-audiospectrum-pattern-composition-ids.cjs
node scripts/list-audiospectrum-file-composition-ids.cjs
node scripts/list-location-composition-ids.cjs
node scripts/list-minimap-composition-ids.cjs
node scripts/list-background-composition-ids.cjs
node scripts/list-onetake-composition-ids.cjs
./render.sh check   # verify resolve_output_subdir() covers every enumerated ID
./render.sh TextEffects
./render.sh TextEffectsJp   # a fixed representative-sample list of *Jp IDs (TEXT_EFFECTS_JP_SAMPLE_IDS in render.sh)
./render.sh NeonText-LchikaOrangeJp   # anything that isn't a subcommand is treated as a composition ID and rendered in order (multiple allowed)
./render.sh --transparent-bg NeonText-LchikaOrangeJp
./render.sh help
./render.sh all
```

## Related Files

| Content | Path |
|------|------|
| Merging / location keys | `src/composition/composition-merged.ts`, `merge-composition-local.ts` |
| Types (JSON) | `src/composition/composition-text-local.ts` |
| Build-time injection | `remotion.config.ts` |
| Canonical render notes / subcommand list | `render.sh help` (the header comment in `render.sh` is a short example only — not maintained as a second source of truth) |

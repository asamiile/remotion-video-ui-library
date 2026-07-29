---
description: Standard file structure for new compositions: unified .schema.ts combining schema, types, duration, and defaults
alwaysApply: true
---

# Composition Schema Unification

All Remotion compositions in this repository follow a unified file structure. Each component's configuration lives in a single `.schema.ts` file combining schema definition, type exports, duration constant, and default properties — eliminating the need for separate `*-config.ts` and `*-schema.ts` files.

## Standard structure for each component

File: `src/<Folder>/<ComponentName>-v1/<component-name>.schema.ts`

```typescript
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
// ... other imports as needed

// 1. Zod schema definition
export const componentSchemaV1 = z.object({
  prop1: z.string().default("default value"),
  prop2: z.number().min(0).max(100).default(50),
  // ... all props with sensible Zod validators and defaults
});

// 2. TypeScript type export
export type ComponentSchemaV1Type = z.infer<typeof componentSchemaV1>;

// 3. Duration constant (frames, typically at 30fps)
export const componentV1DurationFrames = 3000;

// 4. Default props (plain JS object matching schema)
export const defaultComponentV1Props = {
  prop1: "default value",
  prop2: 50,
  // ... copy all schema field defaults
} as const;

// 5. Pattern family (if multiple variants exist)
// Single variant (most common):
export const componentV1Patterns = {
  default: defaultComponentV1Props,
} as const;

// Multiple variants (e.g., CodeStream horizontal/vertical):
export const codeStreamV1Patterns = {
  horizontal: defaultCodeStreamHorizontalV1Props,
  vertical: defaultCodeStreamVerticalV1Props,
} as const;
```

## Key rules

- **File naming:** Use `component-name.schema.ts` (kebab-case with single middle dot before `.schema`), not `component-name-schema.ts` or `component-name-config.ts`.
  - ✅ `led-text.schema.ts`
  - ❌ `led-text-schema.ts` / `led-text-config.ts`
  - ✅ `code-stream.schema.ts`

- **Patterns export:** Every schema file exports a `*V1Patterns` object. For single-variant components, export `{ default: defaultComponentV1Props }`. For multi-variant components, list all variants as keys.

- **Duration:** Store duration as an integer constant (`*V1DurationFrames`), not baked into the schema. Remotion and render.sh scripts depend on this consistent naming.

- **Default props:** Must be `as const` to preserve type narrowness. Keep field order and names exactly aligned with the Zod schema.

- **No deprecation shims:** Old split files (*-config.ts / *-schema.ts) are deleted during unification. Deletion is safe because:
  1. Schema and config are only consumed by composition-merged.ts and scripts (all updated).
  2. Composition IDs in Root.tsx are stable (enum generated from Patterns keys, not from file paths).
  3. No other code imports from old file paths.

## Integration with composition-merged.ts

After unification:

1. **Update** `scripts/generate-composition-merged.cjs` families array to reference the new `.schema.ts` file:
   ```js
   { type: "pattern", file: "Text/ComponentName/ComponentName-v1/component-name.schema", export: "componentNameV1Patterns" }
   ```
   (Note: omit the `.ts` extension; the script appends it).

2. **Regenerate:**
   ```bash
   npm run generate:merged-composition
   ```

3. **Verify:** Check that `src/composition/composition-merged.ts` imports and exports the Patterns correctly.

## History

- **Phase 1** (2026-07-27): Unified 5 components (CodeStream, DottedLineMarkerText, TornNoteCaption, StackedRevealText, TypewriterText).
- **Phase 2-4** (2026-07-29): Unified remaining 30+ components (Text, UI, Background, Effect, Loading, Audio, Map, Intro, Logo, Motion).
- **All files** now follow standard `.schema.ts` naming and structure. Old split files deleted.

## Related

- [.agents/rules/composition-update-runbook.md](./composition-update-runbook.md) — adding patterns to an existing family.
- [.agents/rules/config-local-layout.md](./config-local-layout.md) — local overrides via `composition-text.local.json`.
- `scripts/generate-composition-merged.cjs` — auto-generates exports for composition-merged.ts.

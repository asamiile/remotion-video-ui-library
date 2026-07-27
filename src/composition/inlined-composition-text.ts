import type { CompositionTextLocal } from "./composition-text-local";

/**
 * webpack (inject-composition-text.cjs) replaces this module's entire contents at build time.
 * Under `tsc` alone these stay placeholders (merge-composition-local falls back to example).
 */
export const __COMPOSITION_TEXT_INLINED__: CompositionTextLocal =
  {} as CompositionTextLocal;

export const __LOCATION_V1_KEYS_INLINED__: string[] = [];

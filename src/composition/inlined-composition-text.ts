import type { CompositionTextLocal } from "./composition-text-local";

/**
 * webpack（inject-composition-text.cjs）がビルド時にこのモジュール全文を差し替える。
 * `tsc` 単体ではプレースホルダ（merge-composition-local が example へフォールバック）。
 */
export const __COMPOSITION_TEXT_INLINED__: CompositionTextLocal =
  {} as CompositionTextLocal;

export const __LOCATION_V1_KEYS_INLINED__: string[] = [];

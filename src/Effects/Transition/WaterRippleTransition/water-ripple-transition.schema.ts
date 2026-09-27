import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const waterRippleTransitionAnimationDurationFrames = 60;

/** Overlay: water seals the frame at the midpoint; glints elsewhere. */
export const waterRippleTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the water */
  backgroundColor: zColor(),
  waterColor: zColor(),
  highlightColor: zColor(),
  /** Ring density */
  frequency: z.number().min(10).max(80),
  /** Wave height; drives the highlights */
  amplitude: z.number().min(0).max(0.3),
  /** Main drop plus up to two follow-up drops */
  dropCount: z.number().int().min(1).max(3),
  randomSeed: z.number().int().min(0).max(999),
});
export type WaterRippleTransitionSchemaType = z.infer<
  typeof waterRippleTransitionSchema
>;

/** Clear turquoise water */
const aquaFlood: WaterRippleTransitionSchemaType = {
  backgroundColor: "#0b0d12",
  waterColor: "#1f8fa8",
  highlightColor: "#ffffff",
  frequency: 34,
  amplitude: 0.1,
  dropCount: 3,
  randomSeed: 4,
};

/** Deep ink-blue water with a single drop */
const deepPool: WaterRippleTransitionSchemaType = {
  ...aquaFlood,
  waterColor: "#12245a",
  highlightColor: "#cfe6ff",
  frequency: 24,
  dropCount: 1,
  randomSeed: 18,
};

/** Same look with no backdrop: only the water is drawn, for layering over footage. */
const transparent = (
  pattern: WaterRippleTransitionSchemaType,
): WaterRippleTransitionSchemaType => ({
  ...pattern,
  backgroundColor: "transparent",
});

export const waterRippleTransitionPatterns: Record<
  string,
  WaterRippleTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  aquaFlood: aquaFlood,
  deepPool: deepPool,
  aquaFloodTransparent: transparent(aquaFlood),
  deepPoolTransparent: transparent(deepPool),
};

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const dryBrushTransitionAnimationDurationFrames = 60;
export const dryBrushTransitionDurationFrames = () =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 150
    : dryBrushTransitionAnimationDurationFrames;

/** Overlay: paint seals the frame at the midpoint; transparent elsewhere. */
export const dryBrushTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the paint */
  backgroundColor: zColor(),
  paintColor: zColor(),
  strokeCount: z.number().int().min(3).max(8),
  /** How much the brush runs dry toward the end of each stroke */
  dryness: z.number().min(0).max(1),
  randomSeed: z.number().int().min(0).max(999),
});
export type DryBrushTransitionSchemaType = z.infer<
  typeof dryBrushTransitionSchema
>;

/** Near-black paint in five strokes */
const charcoalStrokes: DryBrushTransitionSchemaType = {
  backgroundColor: "#d8d4cc",
  paintColor: "#1b1b1e",
  strokeCount: 5,
  dryness: 0.7,
  randomSeed: 9,
};

/** Bold red in fewer, wider strokes that dry out more */
const crimsonStrokes: DryBrushTransitionSchemaType = {
  ...charcoalStrokes,
  paintColor: "#b3122e",
  strokeCount: 4,
  dryness: 0.9,
  randomSeed: 31,
};

/** Same look with no backdrop: only the paint is drawn, for layering over footage. */
const transparent = (
  pattern: DryBrushTransitionSchemaType,
): DryBrushTransitionSchemaType => ({
  ...pattern,
  backgroundColor: "transparent",
});

export const dryBrushTransitionPatterns: Record<
  string,
  DryBrushTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  charcoalStrokes: charcoalStrokes,
  crimsonStrokes: crimsonStrokes,
  charcoalStrokesTransparent: transparent(charcoalStrokes),
  crimsonStrokesTransparent: transparent(crimsonStrokes),
};

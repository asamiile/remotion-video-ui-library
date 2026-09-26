import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const suminagashiTransitionAnimationDurationFrames = 72;
export const suminagashiTransitionDurationFrames = () =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 150
    : suminagashiTransitionAnimationDurationFrames;

/** Overlay: ink seals the frame at the midpoint; transparent elsewhere. */
export const suminagashiTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the ink */
  backgroundColor: zColor(),
  inkColor: zColor(),
  /** Alternate ring color */
  ink2Color: zColor(),
  /** Ring density */
  ringFrequency: z.number().min(2).max(30),
  /** Vortex strength twisting the rings */
  swirl: z.number().min(0).max(2),
  dropCount: z.number().int().min(1).max(4),
  randomSeed: z.number().int().min(0).max(999),
});
export type SuminagashiTransitionSchemaType = z.infer<
  typeof suminagashiTransitionSchema
>;

/** Classic black sumi with pale gray rings */
const sumiSwirl: SuminagashiTransitionSchemaType = {
  backgroundColor: "#efe9dc",
  inkColor: "#121216",
  ink2Color: "#8a8a90",
  ringFrequency: 9,
  swirl: 1.1,
  dropCount: 3,
  randomSeed: 12,
};

/** Indigo and vermilion rings, tighter and more twisted */
const indigoMarble: SuminagashiTransitionSchemaType = {
  ...sumiSwirl,
  inkColor: "#1c3a7a",
  ink2Color: "#c8452f",
  ringFrequency: 11,
  swirl: 1.25,
  dropCount: 2,
  randomSeed: 40,
};

/** Same look with no backdrop: only the ink is drawn, for layering over footage. */
const transparent = (
  pattern: SuminagashiTransitionSchemaType,
): SuminagashiTransitionSchemaType => ({
  ...pattern,
  backgroundColor: "transparent",
});

export const suminagashiTransitionPatterns: Record<
  string,
  SuminagashiTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  sumiSwirl: sumiSwirl,
  indigoMarble: indigoMarble,
  sumiSwirlTransparent: transparent(sumiSwirl),
  indigoMarbleTransparent: transparent(indigoMarble),
};

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const pixelSortTransitionAnimationDurationFrames = 60;

/** Sorted-gradient drips melt down from the top until the frame is covered, then fall out the bottom. */
export const pixelSortTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the effect */
  backgroundColor: zColor(),
  colorA: zColor(),
  colorB: zColor(),
  colorC: zColor(),
  /** Width of each sorted column in pixels */
  columnWidth: z.number().int().min(1).max(24),
  randomSeed: z.number().int().min(0).max(999),
});
export type PixelSortTransitionSchemaType = z.infer<
  typeof pixelSortTransitionSchema
>;

/** Gold to pink to violet drips */
const sunsetMelt: PixelSortTransitionSchemaType = {
  backgroundColor: "#101014",
  colorA: "#ffd166",
  colorB: "#ff5d8f",
  colorC: "#3a0ca3",
  columnWidth: 3,
  randomSeed: 5,
};

/** Ice white to cyan to purple drips */
const cyberMelt: PixelSortTransitionSchemaType = {
  backgroundColor: "#101014",
  colorA: "#e8fdff",
  colorB: "#00d9ff",
  colorC: "#5a189a",
  columnWidth: 4,
  randomSeed: 17,
};

/** Same look with no backdrop, for layering over footage. */
const transparent = (
  pattern: PixelSortTransitionSchemaType,
): PixelSortTransitionSchemaType => ({
  ...pattern,
  backgroundColor: "transparent",
});

export const pixelSortTransitionPatterns: Record<
  string,
  PixelSortTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  sunsetMelt: sunsetMelt,
  cyberMelt: cyberMelt,
  sunsetMeltTransparent: transparent(sunsetMelt),
  cyberMeltTransparent: transparent(cyberMelt),
};

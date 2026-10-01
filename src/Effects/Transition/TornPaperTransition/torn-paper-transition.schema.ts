import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const tornPaperTransitionAnimationDurationFrames = 60;

/**
 * Overlay: a sheet of paper with a torn leading edge slides across and seals
 * the frame at the midpoint, then rips along a jagged line and the two halves
 * pull apart. Transparent before and after. See .agents/design/grunge.md.
 */
export const tornPaperTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the paper */
  backgroundColor: zColor(),
  paperColor: zColor(),
  /** Exposed paper fibers along torn edges */
  fiberColor: zColor(),
  /** Stains and specks printed into the paper */
  grimeColor: zColor(),
  /** Amount of stains and specks, 0-1 */
  grime: z.number().min(0).max(1),
  randomSeed: z.number().int().min(0).max(999),
});
export type TornPaperTransitionSchemaType = z.infer<
  typeof tornPaperTransitionSchema
>;

/** Brown kraft paper with cream fibers */
const kraft: TornPaperTransitionSchemaType = {
  backgroundColor: "transparent",
  paperColor: "#c49a6c",
  fiberColor: "#f1e3c8",
  grimeColor: "#6b4a2b",
  grime: 0.5,
  randomSeed: 4,
};

/** Off-white newsprint with grey smudges */
const newsprint: TornPaperTransitionSchemaType = {
  ...kraft,
  paperColor: "#e7e1d3",
  fiberColor: "#ffffff",
  grimeColor: "#5d5a54",
  grime: 0.45,
  randomSeed: 17,
};

/** Black paper with grey fibers */
const blackPaper: TornPaperTransitionSchemaType = {
  ...kraft,
  paperColor: "#1b1a19",
  fiberColor: "#8c877d",
  grimeColor: "#000000",
  grime: 0.35,
  randomSeed: 29,
};

export const tornPaperTransitionPatterns: Record<
  string,
  TornPaperTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  kraft: kraft,
  newsprint: newsprint,
  blackPaper: blackPaper,
};

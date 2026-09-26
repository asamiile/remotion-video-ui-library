import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const inkBleedTransitionSchema = z.object({
  /** Preview backdrop; becomes transparent with --transparent-bg / --alpha */
  backgroundColor: zColor().default("#ece6d8"),
  inkColor: zColor().default("#121216"),
  /** Darker pigment collecting along the drying edge */
  rimColor: zColor().default("#000000"),
  rimStrength: z.number().min(0).max(1).default(0.6),
  /** Number of ink drops (the first always lands in the center) */
  seedCount: z.number().int().min(1).max(8).default(1),
  /** 0 = drops gather at the center, 1 = scattered across the frame */
  spread: z.number().min(0).max(1).default(0),
  /** How late the later drops may start, as a fraction of the spread */
  stagger: z.number().min(0).max(0.8).default(0.3),
  /** Large-scale irregularity of the stain outline */
  warp: z.number().min(0).max(1.5).default(0.6),
  /** Fibrous feathering along the edge */
  fringe: z.number().min(0).max(2).default(1),
  /** Pigment unevenness inside the stain */
  granulation: z.number().min(0).max(1).default(0.5),
  randomSeed: z.number().int().min(0).max(999).default(7),
});

export type InkBleedTransitionSchemaType = z.infer<
  typeof inkBleedTransitionSchema
>;

/** Ink spreads until the frame is covered, holds, then bleeds open. */
export const inkBleedTransitionAnimationDurationFrames = 60;
export const inkBleedTransitionDurationFrames = () =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 150
    : inkBleedTransitionAnimationDurationFrames;

export const defaultInkBleedTransitionProps = {
  backgroundColor: "#ece6d8",
  inkColor: "#121216",
  rimColor: "#000000",
  rimStrength: 0.6,
  seedCount: 1,
  spread: 0,
  stagger: 0.3,
  warp: 0.6,
  fringe: 1,
  granulation: 0.5,
  randomSeed: 7,
} as const;

/** A single drop of black sumi ink */
const sumiDrop: InkBleedTransitionSchemaType = {
  ...defaultInkBleedTransitionProps,
};

/** Several indigo drops blooming across the frame */
const indigoBloom: InkBleedTransitionSchemaType = {
  ...defaultInkBleedTransitionProps,
  inkColor: "#1d2f66",
  rimColor: "#0a1233",
  rimStrength: 0.8,
  seedCount: 5,
  spread: 0.8,
  stagger: 0.45,
  warp: 0.8,
  randomSeed: 21,
};

/** Crimson ink with a strong dried rim */
const crimsonSeep: InkBleedTransitionSchemaType = {
  ...defaultInkBleedTransitionProps,
  inkColor: "#8f1424",
  rimColor: "#3a040b",
  rimStrength: 1,
  seedCount: 3,
  spread: 0.5,
  warp: 1,
  fringe: 1.4,
  randomSeed: 58,
};

/** White ink spreading over a dark backdrop */
const whiteWash: InkBleedTransitionSchemaType = {
  ...defaultInkBleedTransitionProps,
  backgroundColor: "#0c0c0f",
  inkColor: "#f1ede4",
  rimColor: "#b9b1a0",
  rimStrength: 0.5,
  seedCount: 6,
  spread: 1,
  stagger: 0.5,
  fringe: 0.7,
  granulation: 0.3,
  randomSeed: 3,
};

/** Same look with no backdrop: only the ink is drawn, for layering over footage. */
const transparent = (
  pattern: InkBleedTransitionSchemaType,
): InkBleedTransitionSchemaType => ({
  ...pattern,
  backgroundColor: "transparent",
});

export const inkBleedTransitionPatterns: Record<
  string,
  InkBleedTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  sumiDrop: sumiDrop,
  indigoBloom: indigoBloom,
  crimsonSeep: crimsonSeep,
  whiteWash: whiteWash,
  sumiDropTransparent: transparent(sumiDrop),
  indigoBloomTransparent: transparent(indigoBloom),
  crimsonSeepTransparent: transparent(crimsonSeep),
  whiteWashTransparent: transparent(whiteWash),
};

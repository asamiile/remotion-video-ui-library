import { zColor } from "@remotion/zod-types";
import { z } from "zod";

const dottedLineMarkerTextTransitionItemSchema = z.object({
  leftText: z.string(),
  rightText: z.string(),
});

export const dottedLineMarkerTextTransitionSchema = z.object({
  fontSize: z.number().min(12).max(64).default(24),
  textColor: zColor().default("#EEF1FC"),
  backgroundColor: zColor().default("#060810"),

  /** Rows shown before the transition */
  itemsA: z.array(dottedLineMarkerTextTransitionItemSchema).default([]),
  /** Rows shown after the transition */
  itemsB: z.array(dottedLineMarkerTextTransitionItemSchema).default([]),

  /** Frame at which the row-by-row glitch handover begins */
  transitionStartFrame: z.number().min(0).default(360),
  /** Total frames the handover takes across all rows (last row finishes at transitionStartFrame + this) */
  transitionDurationFrames: z.number().min(1).default(60),
  /** How long a single row's own glitch handover takes */
  rowGlitchDurationFrames: z.number().min(1).default(24),

  /** Glitch look, matched to GlitchText-HarshSignalJp */
  rgbOffsetMax: z.number().min(0).max(24).default(12),
  strongGlitchProbability: z.number().min(0).max(1).default(0.32),
  glitchSegmentFrames: z.number().min(2).default(4),
  garbleRate: z.number().min(0).max(1).default(0.42),
  jitterPx: z.number().min(0).max(12).default(3),
  channelRColor: zColor().default("rgba(255, 51, 102, 0.55)"),
  channelBColor: zColor().default("rgba(51, 204, 255, 0.55)"),

  /** Independent left/right text flicker throughout the composition */
  flickerProbability: z.number().min(0).max(1).default(0.12),
  flickerSegmentFrames: z.number().int().min(1).default(3),
  flickerMinimumOpacity: z.number().min(0).max(1).default(0.35),

  randomSeed: z.string().default("dotted-line-marker-transition"),
});

export type DottedLineMarkerTextTransitionSchemaType = z.infer<
  typeof dottedLineMarkerTextTransitionSchema
>;

// 12s before the switch + 2s glitch handover + 20s after = 34s total.
export const dottedLineMarkerTextTransitionDurationFrames = 1020;

export const defaultDottedLineMarkerTextTransitionProps: DottedLineMarkerTextTransitionSchemaType =
  {
    fontSize: 24,
    textColor: "#EEF1FC",
    backgroundColor: "#060810",
    itemsA: [],
    itemsB: [],
    transitionStartFrame: 360,
    transitionDurationFrames: 60,
    rowGlitchDurationFrames: 24,
    rgbOffsetMax: 12,
    strongGlitchProbability: 0.32,
    glitchSegmentFrames: 4,
    garbleRate: 0.42,
    jitterPx: 3,
    channelRColor: "rgba(255, 51, 102, 0.55)",
    channelBColor: "rgba(51, 204, 255, 0.55)",
    flickerProbability: 0.12,
    flickerSegmentFrames: 3,
    flickerMinimumOpacity: 0.35,
    randomSeed: "dotted-line-marker-transition",
  };

export const dottedLineMarkerTextTransitionPatterns = {
  default: defaultDottedLineMarkerTextTransitionProps,
} as const;

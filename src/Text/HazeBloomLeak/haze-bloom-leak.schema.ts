import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { hazeBloomLeakPatterns } from "../../Background/HazeBloomLeak/haze-bloom-leak.schema";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

const backgroundPatternIds = Object.keys(hazeBloomLeakPatterns) as [string, ...string[]];

/**
 * Large foreground text held still at the center, over a HazeBloomLeak
 * background drifting from top to bottom, so the two layers read at
 * different depths.
 */
export const hazeBloomLeakTextSchema = z.object({
  text: z.string().default("Sample Text"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(24).max(480).default(260),
  fontWeight: z.number().min(100).max(900).default(700),
  letterSpacing: z.string().default("-0.02em"),
  textColor: zColor().default("#ffffff"),
  /** Text opacity, independent of textColor (0 = invisible, 1 = opaque) */
  textOpacity: z.number().min(0).max(1).default(1),
  /** Horizontal offset from center, as a fraction of frame width (positive = right) */
  textOffsetX: z.number().min(-0.5).max(0.5).default(0),
  /** Vertical offset from center, as a fraction of frame height (positive = down) */
  textOffsetY: z.number().min(-0.5).max(0.5).default(0),

  /** HazeBloomLeak pattern drawn behind the text */
  backgroundPattern: z.enum(backgroundPatternIds).default("edgeWarm"),
  /** How far the background moves down over the composition, as a fraction of frame height */
  backgroundTravel: z.number().min(0).max(1).default(0.3),

  /** Ease in and out of the travel (0 = constant speed, 1 = full ease) */
  easing: z.number().min(0).max(1).default(0.35),
});

export type HazeBloomLeakTextSchemaType = z.infer<typeof hazeBloomLeakTextSchema>;

/** The background loops once over the composition, so its travel and leak breathing share one cycle. */
export const hazeBloomLeakTextDurationFrames = 300;

export const defaultHazeBloomLeakTextProps = {
  text: "Sample Text",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 300,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  textColor: "#ffffff",
  textOpacity: 0.5,
  textOffsetX: 0,
  textOffsetY: 0,

  backgroundPattern: "edgeMono",
  backgroundTravel: 0.3,

  easing: 0.35,
} as const;

export const hazeBloomLeakTextPatterns = {
  /** "Sample Text" held still over warm edge leaks drifting down (English default) */
  edgeMono: {
    ...defaultHazeBloomLeakTextProps,
  },

  edgeWarm: {
    ...defaultHazeBloomLeakTextProps,
    backgroundPattern: "edgeWarm",
  },

  sweepDuo: {
    ...defaultHazeBloomLeakTextProps,
    backgroundPattern: "sweepDuo",
  },

  sweepDuoJa: {
    ...defaultHazeBloomLeakTextProps,
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    fontSize: 130,
    backgroundPattern: "sweepDuo",
  },

  topMono: {
    ...defaultHazeBloomLeakTextProps,
    textOffsetX: -0.025,
    textOffsetY: 0.3,
    backgroundPattern: "topMono",
  },

  sectionBuild: {
    ...defaultHazeBloomLeakTextProps,
    backgroundPattern: "sectionBuild",
  },

  sectionDrop: {
    ...defaultHazeBloomLeakTextProps,
    backgroundPattern: "sectionDrop",
  },

  sectionBreakdown: {
    ...defaultHazeBloomLeakTextProps,
    backgroundPattern: "sectionBreakdown",
  },
};

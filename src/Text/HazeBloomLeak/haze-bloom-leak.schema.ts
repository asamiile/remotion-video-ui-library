import { z } from "zod";
import { hazeBloomLeakPatterns } from "../../Background/HazeBloomLeak/haze-bloom-leak.schema";
import { centeredTextFields, defaultCenteredTextProps } from "../../helpers/centered-text-layer";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";

const backgroundPatternIds = Object.keys(hazeBloomLeakPatterns) as [string, ...string[]];

/**
 * Large foreground text held still at the center, over a HazeBloomLeak
 * background drifting from top to bottom, so the two layers read at
 * different depths.
 */
export const hazeBloomLeakTextSchema = z.object({
  ...centeredTextFields,

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
  ...defaultCenteredTextProps,
  fontSize: 300,
  textOpacity: 0.5,

  backgroundPattern: "edgeMono",
  backgroundTravel: 0.3,

  easing: 0.35,
} as const satisfies HazeBloomLeakTextSchemaType;

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
} satisfies Record<string, HazeBloomLeakTextSchemaType>;

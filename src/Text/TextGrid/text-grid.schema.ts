import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

export const TEXT_GRID_EFFECTS = ["none", "flicker", "glitch"] as const;
export const TEXT_GRID_EFFECT_ORDERS = ["sequential", "shuffled"] as const;

/** Text laid out in a grid of blocks, one text per block, filled row by row. */
export const textGridSchema = z.object({
  /** One entry per block, left to right then top to bottom; "\n" breaks a line */
  texts: z.array(z.string()),
  columns: z.number().int().min(1).max(8).default(3),
  rows: z.number().int().min(1).max(8).default(2),

  /** Space between blocks (px) */
  gapPx: z.number().min(0).max(200).default(24),
  /** Space between the grid and the frame edge (px) */
  paddingPx: z.number().min(0).max(400).default(96),
  /** Block fill; set it to backgroundColor to hide the blocks */
  blockColor: zColor().default("#10131c"),
  blockRadiusPx: z.number().min(0).max(100).default(0),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(8).max(300).default(56),
  fontWeight: z.number().min(100).max(900).default(700),
  textColor: zColor().default("#ffffff"),
  /** Made transparent by --transparent-bg */
  backgroundColor: zColor().default("#060810"),

  /**
   * Effect each block's text plays once, at its own time.
   * flicker = neon tube switching on (`helpers/effect-neon-flicker.ts`);
   * glitch = RGB split, garbled characters, and jitter for glitchDurationFrames
   */
  effect: z.enum(TEXT_GRID_EFFECTS).default("none"),
  /** sequential = block 1, 2, 3, ... in order; shuffled = a random order fixed by effectSeed */
  effectOrder: z.enum(TEXT_GRID_EFFECT_ORDERS).default("shuffled"),
  /** Frame at which the first block's effect starts */
  effectStartFrame: z.number().int().min(0).default(15),
  /** Frames between one block's effect and the next */
  effectStaggerFrames: z.number().int().min(0).default(10),
  effectSeed: z.string().default("text-grid"),

  /** How long each block glitches before settling back to clean text */
  glitchDurationFrames: z.number().int().min(1).default(45),
  /** Max horizontal offset of the colored channel copies (px) */
  rgbOffsetMax: z.number().min(0).max(24).default(12),
  /** Chance that a segment is a strong burst (garbled characters, bigger offset) */
  strongGlitchProbability: z.number().min(0).max(1).default(0.32),
  /** Frames per glitch segment; offsets and bursts re-roll every segment */
  glitchSegmentFrames: z.number().int().min(1).default(4),
  /** Share of characters replaced during a strong burst */
  garbleRate: z.number().min(0).max(1).default(0.42),
  jitterPx: z.number().min(0).max(12).default(3),
  /** #FC75E8 at 55% */
  channelRColor: zColor().default("rgba(252, 117, 232, 0.55)"),
  /** #61CCF9 at 55% */
  channelBColor: zColor().default("rgba(97, 204, 249, 0.55)"),
});

export type TextGridSchemaType = z.infer<typeof textGridSchema>;

export const textGridDurationFrames = 300;

export const defaultTextGridProps = {
  texts: ["Text 01", "Text 02", "Text 03", "Text 04", "Text 05", "Text 06"],
  columns: 3,
  rows: 2,

  gapPx: 24,
  paddingPx: 0,
  blockColor: "#10131c",
  blockRadiusPx: 0,

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 56,
  fontWeight: 700,
  textColor: "#ffffff",
  backgroundColor: "#060810",

  effect: "none",
  effectOrder: "shuffled",
  effectStartFrame: 15,
  effectStaggerFrames: 10,
  effectSeed: "text-grid",

  glitchDurationFrames: 45,
  rgbOffsetMax: 12,
  strongGlitchProbability: 0.32,
  glitchSegmentFrames: 4,
  garbleRate: 0.42,
  jitterPx: 3,
  channelRColor: "rgba(252, 117, 232, 0.55)",
  channelBColor: "rgba(97, 204, 249, 0.55)",
} satisfies TextGridSchemaType;

export const textGridPatterns = {
  /** Six blocks, three across and two down */
  grid3x2: defaultTextGridProps,

  /** Same grid; the blocks flicker on one after another in a shuffled order */
  grid3x2Flicker: {
    ...defaultTextGridProps,
    effect: "flicker",
  },

  /**
   * Same grid with GlitchTextRandom's harsh-signal glitch; each block glitches
   * for 1.5 seconds in a shuffled order, one after another across the clip
   */
  grid3x2Glitch: {
    ...defaultTextGridProps,
    effect: "glitch",
    effectStaggerFrames: 45,
  },
} satisfies Record<string, TextGridSchemaType>;

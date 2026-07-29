import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const STACKED_REVEAL_ORIENTATIONS = ["vertical", "horizontal"] as const;

export const stackedRevealTextSchema = z.object({
  /** One entry per line. Lines already shown stay on screen while the next line stacks on top */
  lines: z.array(z.string()).default(["MEASURING", "THE GAP"]),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(16).max(160).default(64),
  letterSpacing: z.string().default("0.04em"),
  lineHeight: z.number().min(1).max(2).default(1.15),

  textColor: zColor().default("#eef1fc"),
  backgroundColor: zColor().default("#060810"),

  /** vertical: Japanese vertical writing mode (newer lines stack toward the left). horizontal: stacks top to bottom */
  orientation: z.enum(STACKED_REVEAL_ORIENTATIONS).default("vertical"),

  /** Gap between lines (px) */
  lineGapPx: z.number().min(0).default(28),

  /** Frames each line holds before switching to the next. The reference PV runs at 24fps with roughly a 0.25-0.5s interval */
  holdFramesPerLine: z.number().min(1).default(15),
  /** Fade-in length when each line appears (frames). 0 makes it a hard cut */
  lineFadeInFrames: z.number().min(0).default(4),

  /** Climax effect: wraps the text in a glow (halo) */
  haloEnabled: z.boolean().default(false),
  haloColor: zColor().default("#ff3d9e"),
  haloBlurPx: z.number().min(0).max(60).default(18),

  delayFrames: z.number().min(0).default(0),
});

export type StackedRevealTextSchemaType = z.infer<
  typeof stackedRevealTextSchemaV1
>;

export const stackedRevealTextDurationFrames = 210;

export const defaultStackedRevealTextProps = {
  lines: ["MEASURING", "THE GAP", "BETWEEN IDEA AND SHIP"],
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 64,
  letterSpacing: "0.04em",
  lineHeight: 1.15,

  textColor: "#eef1fc",
  backgroundColor: "#060810",

  orientation: "horizontal" as const,
  lineGapPx: 28,

  holdFramesPerLine: 15,
  lineFadeInFrames: 4,

  haloEnabled: false,
  haloColor: "#ff3d9e",
  haloBlurPx: 18,

  delayFrames: 0,
};

export const stackedRevealTextPatterns = {
  /** Filled text (normal), horizontal, short fade close to a hard cut (English default) */
  stacked: {
    ...defaultStackedRevealTextProps,
    lines: ["MEASURING", "THE GAP", "BETWEEN IDEA AND SHIP"],
    orientation: "horizontal" as const,
  },

  /** Vertical writing mode, stacked reveal (Japanese sample). Newer lines stack toward the left */
  stackedJp: {
    ...defaultStackedRevealTextProps,
    lines: ["サンプルの", "見出し行が", "積み上がる例"],
    orientation: "vertical" as const,
    letterSpacing: "0.12em",
  },

  /** Climax effect (Japanese sample): wraps the text in a glow (halo) */
  climaxHaloJp: {
    ...defaultStackedRevealTextProps,
    lines: ["ここが山場", "という例（サンプル）"],
    orientation: "vertical" as const,
    letterSpacing: "0.12em",
    haloEnabled: true,
    haloColor: "#ff3d9e",
    haloBlurPx: 22,
  },
};

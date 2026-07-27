import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const STACKED_REVEAL_ORIENTATIONS = ["vertical", "horizontal"] as const;

export const stackedRevealTextSchemaV1 = z.object({
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

export type StackedRevealTextSchemaV1Type = z.infer<
  typeof stackedRevealTextSchemaV1
>;

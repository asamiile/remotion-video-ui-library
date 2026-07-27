import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const letterboxOverlaySchemaV1 = z.object({
  barColor: zColor().default("#000000"),
  /** Height of each bar (top and bottom) as a percentage of the frame height */
  barHeightPercent: z.number().min(0).max(45).default(12),

  /** Frames for the bars to slide in from off-screen. 0 = bars are present from the first frame */
  revealFrames: z.number().min(0).default(0),
  delayFrames: z.number().min(0).default(0),
});

export type LetterboxOverlaySchemaV1Type = z.infer<
  typeof letterboxOverlaySchemaV1
>;

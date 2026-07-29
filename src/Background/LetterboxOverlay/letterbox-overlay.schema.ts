import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const letterboxOverlaySchema = z.object({
  barColor: zColor().default("#000000"),
  /** Height of each bar (top and bottom) as a percentage of the frame height */
  barHeightPercent: z.number().min(0).max(45).default(12),

  /** Frames for the bars to slide in from off-screen. 0 = bars are present from the first frame */
  revealFrames: z.number().min(0).default(0),
  delayFrames: z.number().min(0).default(0),
});

export type LetterboxOverlaySchemaType = z.infer<
  typeof letterboxOverlaySchema
>;


export const defaultLetterboxOverlayProps = {
  barColor: "#000000",
  barHeightPercent: 12,
  revealFrames: 0,
  delayFrames: 0,
};
export const letterboxOverlayPatterns = {
  /** Bars present from the first frame */
  static: {
    ...defaultLetterboxOverlayProps,
    revealFrames: 0,
  },

  /** Bars slide in from the top/bottom edges */
  revealIn: {
    ...defaultLetterboxOverlayProps,
    revealFrames: 30,
  },
};

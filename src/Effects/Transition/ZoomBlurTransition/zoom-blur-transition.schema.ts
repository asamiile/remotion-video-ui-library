import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const zoomBlurTransitionSchema = z.object({
  backgroundColor: zColor().default("#060810"),

  /** Stand-in for the logo/scene element being zoomed through (a real video/image would replace this) */
  panelColor: zColor().default("#eef1fc"),
  panelSizePx: z.number().min(20).max(800).default(220),

  maxBlurPx: z.number().min(0).max(80).default(36),
  /** Final scale multiplier reached by the end of the ramp */
  zoomScale: z.number().min(1).max(10).default(3.2),
});

export type ZoomBlurTransitionSchemaType = z.infer<
  typeof zoomBlurTransitionSchema
>;

export const zoomBlurTransitionAnimationDurationFrames = 22;
export const zoomBlurTransitionDurationFrames = () =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 150
    : zoomBlurTransitionAnimationDurationFrames;

export const defaultZoomBlurTransitionProps = {
  backgroundColor: "#060810",
  panelColor: "#eef1fc",
  panelSizePx: 220,
  maxBlurPx: 36,
  zoomScale: 3.2,
} as const;

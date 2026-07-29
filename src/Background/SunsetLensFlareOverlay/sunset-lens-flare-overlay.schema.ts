import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const sunsetLensFlareOverlaySchema = z.object({
  flareColor: zColor().default("#ffcf8a"),
  flareXPercent: z.number().min(0).max(100).default(78),
  flareYPercent: z.number().min(0).max(100).default(22),
  flareRadiusPx: z.number().min(1).default(260),

  streakColor: zColor().default("#fff3d6"),
  streakCount: z.number().min(0).max(12).default(5),
  streakLengthPx: z.number().min(1).default(900),
  streakThicknessPx: z.number().min(1).default(3),

  warmWashColor: zColor().default("#ff8a3d"),
  warmWashOpacity: z.number().min(0).max(1).default(0.18),
});

export type SunsetLensFlareOverlaySchemaType = z.infer<
  typeof sunsetLensFlareOverlaySchema
>;


export const defaultSunsetLensFlareOverlayProps = {
  flareColor: "#ffcf8a",
  flareXPercent: 78,
  flareYPercent: 22,
  flareRadiusPx: 260,

  streakColor: "#fff3d6",
  streakCount: 5,
  streakLengthPx: 900,
  streakThicknessPx: 3,

  warmWashColor: "#ff8a3d",
  warmWashOpacity: 0.18,
};
export const sunsetLensFlareOverlayPatterns = {
  /** Orange sunset (default) */
  sunset: {
    ...defaultSunsetLensFlareOverlayProps,
    flareColor: "#ffcf8a",
    warmWashColor: "#ff8a3d",
  },

  /** Pink/magenta golden-hour variant */
  goldenPink: {
    ...defaultSunsetLensFlareOverlayProps,
    flareColor: "#ffd9e8",
    warmWashColor: "#ff3d9e",
    warmWashOpacity: 0.14,
  },
};

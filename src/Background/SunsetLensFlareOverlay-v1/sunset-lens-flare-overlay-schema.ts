import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const sunsetLensFlareOverlaySchemaV1 = z.object({
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

export type SunsetLensFlareOverlaySchemaV1Type = z.infer<
  typeof sunsetLensFlareOverlaySchemaV1
>;

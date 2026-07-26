import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const duotoneGradeOverlaySchemaV1 = z.object({
  /** One chromatic-aberration channel (e.g. magenta-ish) */
  channelAColor: zColor().default("#ff3d9e"),
  /** The other chromatic-aberration channel (e.g. cyan/green-ish) */
  channelBColor: zColor().default("#37e9ff"),
  /** Offset between the two channels (px) */
  channelShiftPx: z.number().min(0).max(24).default(3),
  channelOpacity: z.number().min(0).max(1).default(0.35),

  /** Overall color wash applied on top (the grading's base tone) */
  washColor: zColor().default("#242a42"),
  washOpacity: z.number().min(0).max(1).default(0.18),

  /** Whether to show the top/bottom tracking-noise bands (scan-line noise) */
  trackingNoiseEnabled: z.boolean().default(false),
  trackingNoiseOpacity: z.number().min(0).max(1).default(0.5),
  trackingBandHeightPx: z.number().min(2).default(10),
});

export type DuotoneGradeOverlaySchemaV1Type = z.infer<
  typeof duotoneGradeOverlaySchemaV1
>;

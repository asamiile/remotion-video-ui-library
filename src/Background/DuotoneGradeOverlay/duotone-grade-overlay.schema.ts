import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const duotoneGradeOverlaySchema = z.object({
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

export type DuotoneGradeOverlaySchemaType = z.infer<
  typeof duotoneGradeOverlaySchemaV1
>;


export const defaultDuotoneGradeOverlayProps = {
  channelAColor: "#ff3d9e",
  channelBColor: "#37e9ff",
  channelShiftPx: 3,
  channelOpacity: 0.35,

  washColor: "#242a42",
  washOpacity: 0.18,

  trackingNoiseEnabled: false,
  trackingNoiseOpacity: 0.5,
  trackingBandHeightPx: 10,
};
export const duotoneGradeOverlayPatterns = {
  /** Magenta/green pairing close to the analyzed PV */
  magentaGreen: {
    ...defaultDuotoneGradeOverlayProps,
    channelAColor: "#ff3d9e",
    channelBColor: "#37e9ff",
    trackingNoiseEnabled: true,
  },

  /** Example swapped to OneTake's brand colors (cyan/violet) */
  cyanViolet: {
    ...defaultDuotoneGradeOverlayProps,
    channelAColor: "#37e9ff",
    channelBColor: "#9c7bff",
    washColor: "#060810",
    trackingNoiseEnabled: false,
  },
};

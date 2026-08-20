import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const framedFootageWindowSchema = z.object({
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  backgroundColor: zColor().default("#0b1f1c"),

  /** Geometric diagram lines/circles decorating the margin around the window */
  decorationColor: zColor().default("#3d7a6e"),
  decorationOpacity: z.number().min(0).max(1).default(0.5),

  /** Stand-in fill for embedded footage (a real video/image would replace this area) */
  placeholderFillColor: zColor().default("#1c2b3a"),
  placeholderLabelText: z.string().default("FOOTAGE"),
  placeholderLabelColor: zColor().default("rgba(238,241,252,0.4)"),

  windowWidthPercent: z.number().min(20).max(100).default(72),
  windowHeightPercent: z.number().min(20).max(100).default(64),

  frameColor: zColor().default("#eef1fc"),
  frameThicknessPx: z.number().min(0).max(24).default(2),

  cornerOrnamentEnabled: z.boolean().default(true),
  cornerOrnamentColor: zColor().default("#d7263d"),
  cornerOrnamentSizePx: z.number().min(0).max(80).default(18),

  popInFrames: z.number().min(0).default(14),
  delayFrames: z.number().min(0).default(0),
});

export type FramedFootageWindowSchemaType = z.infer<
  typeof framedFootageWindowSchema
>;

export const framedFootageWindowDurationFrames = 150;

export const defaultFramedFootageWindowProps = {
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  backgroundColor: "#0b1f1c",

  decorationColor: "#3d7a6e",
  decorationOpacity: 0.5,

  placeholderFillColor: "#1c2b3a",
  placeholderLabelText: "FOOTAGE",
  placeholderLabelColor: "rgba(238,241,252,0.4)",

  windowWidthPercent: 72,
  windowHeightPercent: 64,

  frameColor: "#eef1fc",
  frameThicknessPx: 2,

  cornerOrnamentEnabled: true,
  cornerOrnamentColor: "#d7263d",
  cornerOrnamentSizePx: 18,

  popInFrames: 14,
  delayFrames: 0,
} as const;

export const framedFootageWindowPatterns = {
  /** Dark teal grimoire-diagram margin around a centered footage window (English default) */
  diagramWindow: {
    ...defaultFramedFootageWindowProps,
    placeholderLabelText: "FOOTAGE",
  },

  /** Same layout, Japanese sample label */
  diagramWindowJp: {
    ...defaultFramedFootageWindowProps,
    placeholderLabelText: "映像",
  },
};

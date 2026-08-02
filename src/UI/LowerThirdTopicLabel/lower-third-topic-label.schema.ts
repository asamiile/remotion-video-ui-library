import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const lowerThirdTopicLabelSchema = z.object({
  /** Small persistent corner label naming the current topic/segment */
  labelText: z.string().default("TOPIC"),
  /** Bottom caption bar text (explainer-style narration substitute) */
  captionText: z
    .string()
    .default("A short caption describing what's on screen goes here."),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  labelFontSize: z.number().min(10).max(60).default(20),
  captionFontSize: z.number().min(12).max(60).default(24),

  labelBgColor: zColor().default("#8fd9c4"),
  labelTextColor: zColor().default("#0a0e12"),

  captionBarColor: zColor().default("rgba(6, 8, 16, 0.72)"),
  captionTextColor: zColor().default("#eef1fc"),

  backgroundColor: zColor().default("#1c2b3a"),

  slideInFrames: z.number().min(0).default(12),
  delayFrames: z.number().min(0).default(0),
});

export type LowerThirdTopicLabelSchemaType = z.infer<
  typeof lowerThirdTopicLabelSchema
>;

export const lowerThirdTopicLabelDurationFrames = 150;

export const defaultLowerThirdTopicLabelProps = {
  labelText: "TOPIC",
  captionText: "A short caption describing what's on screen goes here.",

  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  labelFontSize: 20,
  captionFontSize: 24,

  labelBgColor: "#8fd9c4",
  labelTextColor: "#0a0e12",

  captionBarColor: "rgba(6, 8, 16, 0.72)",
  captionTextColor: "#eef1fc",

  backgroundColor: "#1c2b3a",

  slideInFrames: 12,
  delayFrames: 0,
} as const;

export const lowerThirdTopicLabelPatterns = {
  /** Mint corner label + bottom caption bar, explainer-video style (English default) */
  explainerBar: {
    ...defaultLowerThirdTopicLabelProps,
    labelText: "TOPIC",
    captionText: "A short caption describing what's on screen goes here.",
  },

  /** Same layout, Japanese sample copy */
  explainerBarJp: {
    ...defaultLowerThirdTopicLabelProps,
    labelText: "トピック",
    captionText: "ここに画面の内容を説明する短いキャプションが入ります。",
  },
};

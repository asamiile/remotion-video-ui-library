import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const rubyWordplayTextSchema = z.object({
  /** The base word/kanji shown at full size */
  baseText: z.string().default("現実"),
  /** The alternate reading revealed as small ruby text above the base word */
  rubyText: z.string().default("メタファー"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontSize: z.number().min(16).max(200).default(88),
  rubyFontSize: z.number().min(8).max(80).default(28),
  letterSpacing: z.string().default("0.04em"),

  textColor: zColor().default("#f4f6ff"),
  rubyColor: zColor().default("#9c7bff"),
  backgroundColor: zColor().default("#05060a"),

  /** How many frames after the base word appears before the ruby reading fades/slides in */
  rubyDelayFrames: z.number().min(0).default(18),
  fadeInFrames: z.number().min(0).default(14),
  delayFrames: z.number().min(0).default(0),
});

export type RubyWordplayTextSchemaType = z.infer<
  typeof rubyWordplayTextSchema
>;

export const rubyWordplayTextDurationFrames = 150;

export const defaultRubyWordplayTextProps = {
  baseText: "現実",
  rubyText: "メタファー",

  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontSize: 88,
  rubyFontSize: 28,
  letterSpacing: "0.04em",

  textColor: "#f4f6ff",
  rubyColor: "#9c7bff",
  backgroundColor: "#05060a",

  rubyDelayFrames: 18,
  fadeInFrames: 14,
  delayFrames: 0,
} as const;

export const rubyWordplayTextPatterns = {
  /** A double-meaning reveal: kanji word with an unrelated katakana reading fading in above it */
  doubleMeaning: {
    ...defaultRubyWordplayTextProps,
    baseText: "現実",
    rubyText: "メタファー",
  },

  /** Same technique, a different sample word pair */
  doubleMeaningAlt: {
    ...defaultRubyWordplayTextProps,
    baseText: "境界",
    rubyText: "ボーダー",
    rubyColor: "#37e9ff",
  },
};

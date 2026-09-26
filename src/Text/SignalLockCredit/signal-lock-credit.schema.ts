import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const signalLockCreditSchema = z.object({
  text: z.string().default("STARRING SAMPLE CAST"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(160).default(44),
  letterSpacing: z.string().default("0.08em"),
  textColor: zColor().default("#f2f4fb"),
  backgroundColor: zColor().default("#05060a"),

  /** Max per-frame jitter offset while a character is still unlocked (px) */
  jitterAmplitudePx: z.number().min(0).max(40).default(6),
  /** Lowest opacity a character's flicker can dip to while unlocked */
  flickerMinOpacity: z.number().min(0).max(1).default(0.25),
  /** Lock band softness, as a fraction of the text's width (0-1) */
  bandWidth: z.number().min(0.02).max(1).default(0.18),

  /** How many frames the lock band takes to sweep once, left to right, across the text */
  sweepDurationFrames: z.number().min(1).default(70),
  delayFrames: z.number().min(0).default(0),
  randomSeed: z.string().default("signal-lock-credit"),
});

export type SignalLockCreditSchemaType = z.infer<typeof signalLockCreditSchema>;

export const signalLockCreditDurationFrames = 130;

export const defaultSignalLockCreditProps = {
  text: "STARRING SAMPLE CAST",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 44,
  letterSpacing: "0.08em",
  textColor: "#f2f4fb",
  backgroundColor: "#05060a",

  jitterAmplitudePx: 6,
  flickerMinOpacity: 0.25,
  bandWidth: 0.18,

  sweepDurationFrames: 70,
  delayFrames: 0,
  randomSeed: "signal-lock-credit",
} as const;

export const signalLockCreditPatterns = {
  /** Characters flicker and jitter like an unlocked signal, then settle left to right (English default) */
  channelLock: {
    ...defaultSignalLockCreditProps,
    text: "STARRING SAMPLE CAST",
  },

  /** Same motion, Japanese sample copy */
  channelLockJp: {
    ...defaultSignalLockCreditProps,
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.06em",
    text: "出演 サンプルキャスト",
  },
};

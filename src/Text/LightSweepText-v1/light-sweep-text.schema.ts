import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const lightSweepTextSchemaV1 = z.object({
  text: z.string().default("COMPLETE"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(24).max(160).default(48),
  letterSpacing: z.string().default("0.14em"),
  lineHeight: z.number().min(1).max(2).default(1.2),

  baseTextColor: zColor().default("#5ba3e8"),
  /** Color the text shifts toward once the sweep has passed / during the completion pulse */
  activeTextColor: zColor().default("#d8ecff"),

  /** Frame (relative, after delay) at which the sweep starts */
  sweepStartFrame: z.number().min(0).default(42),
  sweepDurationFrames: z.number().min(6).default(14),
  sweepEasing: z.enum(["linear", "easeOut", "easeInOut"]).default("easeOut"),

  /** Width of the blurred light band (% of parent text width) */
  sweepBandWidthPercent: z.number().min(12).max(88).default(44),
  /**
   * Tilt of the light band (deg). Negative tilts it up to the left (combined
   * with the horizontal motion, this reads as a diagonal sweep).
   * 0 keeps the original purely vertical band.
   */
  sweepBandTiltDeg: z.number().min(-55).max(55).default(-20),

  /** Blur of the crossing light (px). Larger values diffuse the band so it reads less as a distinct line */
  softGlowBlur: z.number().min(8).max(56).default(32),
  softGlowOpacity: z.number().min(0).max(1).default(0.52),

  /** Text glow pulse after the sweep finishes (frames) */
  completionGlowFrames: z.number().min(0).default(16),
  completionGlowStrength: z.number().min(0).max(2.2).default(1.15),

  fadeInDuration: z.number().min(0).default(14),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#05080f"),
  vignetteOpacity: z.number().min(0).max(0.9).default(0.55),
});

export type LightSweepTextSchemaV1Type = z.infer<typeof lightSweepTextSchemaV1>;

export const lightSweepTextV1DurationFrames = 120;

export const defaultLightSweepTextV1Props = {
  text: "COMPLETE",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.14em",
  lineHeight: 1.2,
  baseTextColor: "#5ba3e8",
  activeTextColor: "#d8ecff",
  sweepStartFrame: 42,
  sweepDurationFrames: 14,
  sweepEasing: "easeOut" as const,
  sweepBandWidthPercent: 44,
  sweepBandTiltDeg: -20,
  softGlowBlur: 32,
  softGlowOpacity: 0.52,
  completionGlowFrames: 16,
  completionGlowStrength: 1.15,
  fadeInDuration: 14,
  delayFrames: 0,
  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,
  backgroundColor: "#05080f",
  vignetteOpacity: 0.55,
} as const;

export const lightSweepTextV1Patterns = {
  /** Processing complete - quick sweep */
  complete: {
    ...defaultLightSweepTextV1Props,
    text: "COMPLETE",
    sweepStartFrame: 48,
    sweepDurationFrames: 12,
    sweepBandWidthPercent: 40,
    softGlowBlur: 30,
    softGlowOpacity: 0.5,
  },

  /** Japanese - slightly longer afterglow */
  doneJp: {
    ...defaultLightSweepTextV1Props,
    text: "処理完了",
    fontSize: 48,
    letterSpacing: "0.18em",
    sweepStartFrame: 54,
    sweepDurationFrames: 16,
    completionGlowFrames: 20,
    sweepBandWidthPercent: 46,
    softGlowBlur: 34,
  },

  /** Fast sweep (crisp/snappy feel) */
  rapid: {
    ...defaultLightSweepTextV1Props,
    text: "OK",
    fontSize: 48,
    sweepStartFrame: 36,
    sweepDurationFrames: 9,
    sweepEasing: "linear" as const,
    sweepBandWidthPercent: 36,
    softGlowBlur: 26,
    softGlowOpacity: 0.48,
  },

  /** Short Japanese version of complete */
  completeJp: {
    ...defaultLightSweepTextV1Props,
    text: "完了",
    letterSpacing: "0.2em",
    sweepStartFrame: 48,
    sweepDurationFrames: 12,
    sweepBandWidthPercent: 40,
    softGlowBlur: 30,
    softGlowOpacity: 0.5,
  },

  /** Short Japanese version of rapid */
  rapidJp: {
    ...defaultLightSweepTextV1Props,
    text: "了解",
    letterSpacing: "0.22em",
    fontSize: 48,
    sweepStartFrame: 36,
    sweepDurationFrames: 9,
    sweepEasing: "linear" as const,
    sweepBandWidthPercent: 36,
    softGlowBlur: 26,
    softGlowOpacity: 0.48,
  },
};

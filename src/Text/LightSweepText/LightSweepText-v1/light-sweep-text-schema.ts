import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

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

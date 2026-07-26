import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const neonTextSchemaV1 = z.object({
  text: z.string().default("SAMPLE"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(24).max(220).default(48),
  letterSpacing: z.string().default("0.12em"),
  /** Line height kept consistent with LightSweep / Shake etc. (affects the visible position when anchored to the bottom) */
  lineHeight: z.number().min(1).max(2).default(1.2),

  coreColor: zColor().default("#fff8f4"),
  glowColor: zColor().default("#ff2fd0"),
  haloColor: zColor().default("#9d4dff"),

  /**
   * gradient: fills with a horizontal linear-gradient (neon-tube look).
   * When solid, coreColor is used instead.
   */
  neonFillMode: z.enum(["solid", "gradient"]).default("solid"),
  /** Gradient stops (left to right), 2-8 colors. Falls back to solid if unset or too few */
  neonGradientStops: z.array(zColor()).min(2).max(8).optional(),

  tubeStrokeColor: zColor().default("rgba(20, 0, 40, 0.45)"),
  tubeStrokeWidth: z.number().min(0).max(6).default(1),

  shadowStrength: z.number().min(0.4).max(1.8).default(1),

  animationMode: z
    .enum(["static", "pulse", "flicker", "breathe", "blink"])
    .default("pulse"),
  pulsePeriodFrames: z.number().min(20).default(90),
  breathePeriodFrames: z.number().min(40).default(140),

  /** LED blink (square wave): frames per full cycle (on + off) */
  blinkPeriodFrames: z.number().min(10).default(60),
  /** Fraction of the cycle spent lit (0.5 = 50% duty) */
  blinkDutyRatio: z.number().min(0.1).max(0.9).default(0.5),
  /** Text/overall opacity while off (closer to 0 = harder blink) */
  blinkDimOpacity: z.number().min(0).max(1).default(0.06),
  /** Multiplier on glow (text-shadow) strength while off */
  blinkGlowOffMul: z.number().min(0).max(1).default(0.12),

  flickerStrength: z.number().min(0).max(0.45).default(0.12),
  randomSeed: z.string().default("neon-v1"),

  fadeInDuration: z.number().min(0).default(30),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#070712"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.55),
});

export type NeonTextSchemaV1Type = z.infer<typeof neonTextSchemaV1>;

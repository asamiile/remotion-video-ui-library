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


export const defaultNeonTextV1Props = {
  text: "SAMPLE",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.14em",
  lineHeight: 1.2,

  coreColor: "#fff5fb",
  glowColor: "#ff3ec9",
  haloColor: "#7c3aed",

  neonFillMode: "solid" as const,

  tubeStrokeColor: "rgba(12, 0, 28, 0.5)",
  tubeStrokeWidth: 1.2,

  shadowStrength: 1,

  animationMode: "pulse" as const,
  pulsePeriodFrames: 85,
  breathePeriodFrames: 130,

  blinkPeriodFrames: 56,
  blinkDutyRatio: 0.5,
  blinkDimOpacity: 0.06,
  blinkGlowOffMul: 0.12,

  flickerStrength: 0.1,
  randomSeed: "neon-default",

  fadeInDuration: 28,
  delayFrames: 0,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  backgroundColor: "#06060c",
  vignetteOpacity: 0.52,
};

const lchikaOrangeBase = {
  ...defaultNeonTextV1Props,
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontSize: 48,
  coreColor: "#fff5e8",
  glowColor: "#ffbf00",
  haloColor: "#c2410c",
  tubeStrokeColor: "rgba(0, 48, 52, 0.58)",
  tubeStrokeWidth: 1.4,
  animationMode: "blink" as const,
  blinkPeriodFrames: 48,
  blinkDutyRatio: 0.5,
  blinkDimOpacity: 0.05,
  blinkGlowOffMul: 0.1,
  flickerStrength: 0,
  shadowStrength: 1.15,
  pulsePeriodFrames: 80,
  backgroundColor: "#05484c",
  vignetteOpacity: 0.48,
};

export const neonTextV1Patterns = {
  pinkPulse: {
    ...defaultNeonTextV1Props,
    text: "SAMPLE OPEN",
    animationMode: "pulse" as const,
    glowColor: "#ff4bd4",
    haloColor: "#a855f7",
    letterSpacing: "0.18em",
  },

  cyanFlicker: {
    ...defaultNeonTextV1Props,
    text: "SAMPLE",
    coreColor: "#e8ffff",
    glowColor: "#22d3ee",
    haloColor: "#38bdf8",
    tubeStrokeColor: "rgba(0, 40, 60, 0.55)",
    animationMode: "flicker" as const,
    flickerStrength: 0.18,
    pulsePeriodFrames: 72,
    randomSeed: "neon-cyan",
  },

  greenBreathe: {
    ...defaultNeonTextV1Props,
    text: "SAMPLE BAR",
    coreColor: "#eefff0",
    glowColor: "#4ade80",
    haloColor: "#16a34a",
    tubeStrokeColor: "rgba(0, 28, 12, 0.5)",
    animationMode: "breathe" as const,
    breathePeriodFrames: 160,
    shadowStrength: 1.15,
  },

  /** Japanese version of pinkPulse */
  pinkPulseJp: {
    ...defaultNeonTextV1Props,
    text: "サンプル オープン",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    animationMode: "pulse" as const,
    glowColor: "#ff4bd4",
    haloColor: "#a855f7",
    letterSpacing: "0.12em",
    randomSeed: "neon-pink-jp",
  },

  /** Japanese version of cyanFlicker */
  cyanFlickerJp: {
    ...defaultNeonTextV1Props,
    text: "クール",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    coreColor: "#e8ffff",
    glowColor: "#22d3ee",
    haloColor: "#38bdf8",
    tubeStrokeColor: "rgba(0, 40, 60, 0.55)",
    animationMode: "flicker" as const,
    flickerStrength: 0.18,
    pulsePeriodFrames: 72,
    letterSpacing: "0.12em",
    randomSeed: "neon-cyan-jp",
  },

  /** Japanese version of greenBreathe */
  greenBreatheJp: {
    ...defaultNeonTextV1Props,
    text: "サンプル バー",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    coreColor: "#eefff0",
    glowColor: "#4ade80",
    haloColor: "#16a34a",
    tubeStrokeColor: "rgba(0, 28, 12, 0.5)",
    animationMode: "breathe" as const,
    breathePeriodFrames: 160,
    shadowStrength: 1.15,
    letterSpacing: "0.1em",
    randomSeed: "neon-green-jp",
  },

  jpStatic: {
    ...defaultNeonTextV1Props,
    text: "NEON SAMPLE",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    animationMode: "static" as const,
    glowColor: "#fb7185",
    haloColor: "#f472b6",
    letterSpacing: "0.08em",
    flickerStrength: 0.06,
    randomSeed: "neon-jp",
  },

  /**
   * Modeled on the Arduino D13 / L LED - amber-to-orange only, square-wave blink.
   * Composition: NeonTextV1-LchikaOrange
   */
  lchikaOrange: {
    ...lchikaOrangeBase,
    text: "L BLINK",
    letterSpacing: "0.22em",
    randomSeed: "neon-lchika-orange",
  },

  /** Same look as lchikaOrange, using the katakana "Lchika" spelling */
  lchikaOrangeJp: {
    ...lchikaOrangeBase,
    text: "エルチカ",
    letterSpacing: "0.2em",
    randomSeed: "neon-lchika-orange-jp",
  },

  /**
   * Modeled on the Arduino power ON LED - lime green only, steady on (static).
   * Composition: NeonTextV1-LchikaGreen
   */
  lchikaGreen: {
    ...defaultNeonTextV1Props,
    text: "ON",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    letterSpacing: "0.28em",
    coreColor: "#ecfccb",
    glowColor: "#39ff14",
    haloColor: "#166534",
    tubeStrokeColor: "rgba(0, 48, 40, 0.58)",
    tubeStrokeWidth: 1.4,
    animationMode: "static" as const,
    flickerStrength: 0,
    shadowStrength: 1.2,
    randomSeed: "neon-lchika-green",
    backgroundColor: "#05484c",
    vignetteOpacity: 0.48,
  },
};

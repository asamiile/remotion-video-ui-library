import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const neonTextRainbowSchemaV1 = z.object({
  text: z.string().default("NEON"),
  fontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(20).max(200).default(48),
  letterSpacing: z.string().default("0.08em"),
  lineHeight: z.number().min(1).max(2).default(1.15),

  /** Frames for the rainbow gradient to complete one full hue cycle (smaller = faster cycling) */
  hueCycleFrames: z.number().min(18).default(72),

  /**
   * true: the gradient gradually shifts from "blue/green" to "yellow/red".
   * false: always stays on the full-spectrum-leaning stop colors.
   */
  colorShiftEnabled: z.boolean().default(true),
  /** Frame the shift starts on (relative, after delay) */
  colorShiftStartFrame: z.number().min(0).default(48),
  /** Length of the blue-green -> yellow-red interpolation (frames). 0 switches instantly at the start frame */
  colorShiftDurationFrames: z.number().min(0).default(48),

  /** Stroke width of the main neon tube */
  strokeWidth: z.number().min(0.5).max(24).default(5),
  /** "Core" highlight inside the tube. 0 skips drawing it */
  innerStrokeWidth: z.number().min(0).max(10).default(2),
  innerStrokeColor: zColor().default("rgba(255, 252, 240, 0.92)"),

  /** Glow blur applied to the main edge (0 = no filter) */
  mainGlowBlur: z.number().min(0).max(24).default(3),
  /** Extra width added beyond the main stroke, for the halo behind it */
  haloExtraWidth: z.number().min(0).max(48).default(8),
  /** Halo blur (0 hides the halo layer entirely) */
  haloGlowBlur: z.number().min(0).max(48).default(16),
  haloOpacity: z.number().min(0).max(1).default(0.45),

  fadeInDuration: z.number().min(0).default(15),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#06060a"),
  vignetteOpacity: z.number().min(0).max(0.92).default(0.52),
});

export type NeonTextRainbowSchemaV1Type = z.infer<typeof neonTextRainbowSchemaV1>;

export const neonTextRainbowV1DurationFrames = 3000;

export const defaultNeonTextRainbowV1Props = {
  text: "NEON",
  fontFamily: JETBRAINS_MONO_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.08em",
  lineHeight: 1.15,
  hueCycleFrames: 72,
  colorShiftEnabled: true,
  colorShiftStartFrame: 48,
  colorShiftDurationFrames: 48,
  strokeWidth: 5,
  innerStrokeWidth: 2,
  innerStrokeColor: "rgba(255, 252, 240, 0.92)",
  mainGlowBlur: 3,
  outerGlowBlur: 6,
  outerGlowOpacity: 0.7,
  animationMode: "pulse" as const,
  pulsePeriodFrames: 90,
  breathePeriodFrames: 180,
  shadowStrength: 1,
  randomSeed: "neon-rainbow-v1",
  fadeInDuration: 15,
  delayFrames: 0,
  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,
  backgroundColor: "#06060a",
  vignetteOpacity: 0.52,
} as const;

export const neonTextRainbowV1Patterns = {
  /**
   * Leans into a rounded-tube look: thicker stroke, thicker core, layered
   * glow, relatively fast hue cycling.
   * Composition: NeonTextV1-RainbowRoundedtube
   */
  roundedTube: {
    ...defaultNeonTextRainbowV1Props,
    text: "TUBE NEON",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    fontSize: 48,
    letterSpacing: "0.12em",
    hueCycleFrames: 80,
    colorShiftStartFrame: 54,
    colorShiftDurationFrames: 52,
    strokeWidth: 6.2,
    innerStrokeWidth: 2.2,
    innerStrokeColor: "rgba(255, 248, 230, 0.94)",
    mainGlowBlur: 4.2,
    haloExtraWidth: 12,
    haloGlowBlur: 22,
    haloOpacity: 0.5,
  },

  /**
   * Same settings as roundedTube, using LINE Seed JP (for Japanese text)
   * Composition: NeonTextV1-RainbowRoundedtubejp
   */
  roundedTubeJp: {
    ...defaultNeonTextRainbowV1Props,
    text: "虹ネオン・太管",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    letterSpacing: "0.1em",
    lineHeight: 1.2,
    hueCycleFrames: 80,
    colorShiftStartFrame: 54,
    colorShiftDurationFrames: 52,
    strokeWidth: 6.2,
    innerStrokeWidth: 2.2,
    innerStrokeColor: "rgba(255, 248, 230, 0.94)",
    mainGlowBlur: 4.2,
    haloExtraWidth: 12,
    haloGlowBlur: 22,
    haloOpacity: 0.5,
  },
};

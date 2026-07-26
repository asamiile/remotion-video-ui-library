import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const neonTextRainbowV1DurationFrames = 360;

const defaultNeonTextRainbowV1Props = {
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
  haloExtraWidth: 8,
  haloGlowBlur: 16,
  haloOpacity: 0.45,

  fadeInDuration: 15,
  delayFrames: 0,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  backgroundColor: "#06060a",
  vignetteOpacity: 0.52,
};

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

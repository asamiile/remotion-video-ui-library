import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const rainbowNeonTextV1DurationFrames = 360;

const defaultRainbowNeonTextV1Props = {
  text: "NEON",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 80,
  letterSpacing: "0.08em",
  lineHeight: 1.15,

  hueCycleFrames: 120,

  colorShiftEnabled: true,
  colorShiftStartFrame: 72,
  colorShiftDurationFrames: 96,

  strokeWidth: 5,
  innerStrokeWidth: 2,
  innerStrokeColor: "rgba(255, 252, 240, 0.92)",

  mainGlowBlur: 3,
  haloExtraWidth: 8,
  haloGlowBlur: 16,
  haloOpacity: 0.45,

  fadeInDuration: 15,
  delayFrames: 0,

  positionX: 50,
  positionY: 50,

  backgroundColor: "#06060a",
  vignetteOpacity: 0.52,
};

export const rainbowNeonTextV1Patterns = {
  /**
   * 角丸チューブ寄り: 太めストローク、太い芯、多段グロー、ゆっくりめの色相循環
   */
  roundedTube: {
    ...defaultRainbowNeonTextV1Props,
    text: "TUBE NEON",
    fontSize: 72,
    hueCycleFrames: 220,
    colorShiftStartFrame: 90,
    colorShiftDurationFrames: 120,
    strokeWidth: 6.2,
    innerStrokeWidth: 2.2,
    innerStrokeColor: "rgba(255, 248, 230, 0.94)",
    mainGlowBlur: 4.2,
    haloExtraWidth: 12,
    haloGlowBlur: 22,
    haloOpacity: 0.5,
  },
};

import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const glitchTextV1DurationFrames = 360;

export const defaultGlitchTextV1Props = {
  text: "測定中",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.08em",
  lineHeight: 1.2,

  textColor: "#e8f4ff",
  channelRColor: "rgba(255, 51, 102, 0.55)",
  channelBColor: "rgba(51, 204, 255, 0.55)",

  rgbOffsetMax: 8,
  strongGlitchProbability: 0.2,
  glitchSegmentFrames: 5,
  garbleRate: 0.42,
  jitterPx: 2,

  scanlineOpacity: 0.08,
  backgroundColor: "#0a0e12",

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  randomSeed: "glitch-default",
  fadeInDuration: 20,
  delayFrames: 0,
};

export const glitchTextV1Patterns = {
  /** デジタルテスター「測定中」 */
  measuring: {
    ...defaultGlitchTextV1Props,
    text: "測定中",
    fontSize: 48,
    randomSeed: "glitch-measuring",
  },

  /** 数値読みがにじむイメージ */
  meterReadout: {
    ...defaultGlitchTextV1Props,
    text: "測定中  —  12.48 V",
    fontSize: 48,
    letterSpacing: "0.05em",
    strongGlitchProbability: 0.22,
    garbleRate: 0.48,
    randomSeed: "glitch-meter",
  },

  /** 強めの乱れ */
  harshSignal: {
    ...defaultGlitchTextV1Props,
    text: "SIGNAL  UNSTABLE",
    fontSize: 48,
    rgbOffsetMax: 12,
    strongGlitchProbability: 0.32,
    glitchSegmentFrames: 4,
    jitterPx: 3,
    randomSeed: "glitch-harsh",
  },
};

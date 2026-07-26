import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const glitchTextV1DurationFrames = 360;

export const defaultGlitchTextV1Props = {
  text: "MEASURING",
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
  /** Equivalent to a digital tester's "measuring" state (English default) */
  measuring: {
    ...defaultGlitchTextV1Props,
    text: "MEASURING",
    fontSize: 48,
    randomSeed: "glitch-measuring",
  },

  /** Meant to evoke a numeric readout smearing/bleeding */
  meterReadout: {
    ...defaultGlitchTextV1Props,
    text: "READING  —  12.48 V",
    fontSize: 48,
    letterSpacing: "0.05em",
    strongGlitchProbability: 0.22,
    garbleRate: 0.48,
    randomSeed: "glitch-meter",
  },

  /** Stronger distortion */
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

  /** Japanese version of harshSignal */
  harshSignalJp: {
    ...defaultGlitchTextV1Props,
    text: "信号 不安定",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    letterSpacing: "0.12em",
    rgbOffsetMax: 12,
    strongGlitchProbability: 0.32,
    glitchSegmentFrames: 4,
    jitterPx: 3,
    randomSeed: "glitch-harsh-jp",
  },
};

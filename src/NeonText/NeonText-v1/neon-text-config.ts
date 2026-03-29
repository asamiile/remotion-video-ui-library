import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

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

/** Arduino D13 / L LED（オレンジ点滅）— lchikaOrange / lchikaOrangeJp 共通 */
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

  /** pinkPulse の日本語版 */
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

  /** cyanFlicker の日本語版 */
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

  /** greenBreathe の日本語版 */
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
   * Arduino D13 / L LED 想定 — アンバー〜オレンジのみ、矩形波点滅。
   * Composition: NeonTextV1-LchikaOrange
   */
  lchikaOrange: {
    ...lchikaOrangeBase,
    text: "L BLINK",
    letterSpacing: "0.22em",
    randomSeed: "neon-lchika-orange",
  },

  /** lchikaOrange と同一見た目・カタカナ「エルチカ」表記用 */
  lchikaOrangeJp: {
    ...lchikaOrangeBase,
    text: "エルチカ",
    letterSpacing: "0.2em",
    randomSeed: "neon-lchika-orange-jp",
  },

  /**
   * Arduino 電源 ON LED 想定 — ライムグリーンのみ、常時点灯（static）。
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

import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const defaultNeonTextV1Props = {
  text: "SAMPLE",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 100,
  letterSpacing: "0.14em",

  coreColor: "#fff5fb",
  glowColor: "#ff3ec9",
  haloColor: "#7c3aed",

  tubeStrokeColor: "rgba(12, 0, 28, 0.5)",
  tubeStrokeWidth: 1.2,

  shadowStrength: 1,

  animationMode: "pulse" as const,
  pulsePeriodFrames: 85,
  breathePeriodFrames: 130,

  flickerStrength: 0.1,
  randomSeed: "neon-default",

  fadeInDuration: 28,
  delayFrames: 0,

  positionX: 50,
  positionY: 50,

  backgroundColor: "#06060c",
  vignetteOpacity: 0.52,
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

  jpStatic: {
    ...defaultNeonTextV1Props,
    text: "ネオンサンプル",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 88,
    animationMode: "static" as const,
    glowColor: "#fb7185",
    haloColor: "#f472b6",
    letterSpacing: "0.08em",
    flickerStrength: 0.06,
    randomSeed: "neon-jp",
  },
};

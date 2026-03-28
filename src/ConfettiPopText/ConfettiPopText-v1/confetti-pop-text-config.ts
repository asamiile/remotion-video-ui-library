import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const confettiPopTextV1DurationFrames = 210;

const defaultConfettiPopTextV1Props = {
  text: "おめでとう！",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 58,
  letterSpacing: "0.08em",
  lineHeight: 1.2,

  textColor: "#fff8f0",

  burstFrame: 22,
  flashPeakOpacity: 0.48,
  flashDurationFrames: 6,

  glowDurationFrames: 26,

  particleCount: 42,
  showShockwaveRing: true,

  particleLifeFrames: 100,
  particleSpread: 12,
  particleGravity: 0.42,

  randomSeed: "confetti-pop-rich",

  fadeInDuration: 8,
  delayFrames: 0,

  positionX: 50,
  positionY: 50,

  backgroundColor: "#1a1428",
};

export const confettiPopTextV1Patterns = {
  /** フラッシュ・スプリング・紙吹雪・衝撃波リング */
  richPop: {
    ...defaultConfettiPopTextV1Props,
    text: "おめでとう！",
  },
};

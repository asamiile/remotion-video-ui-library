import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const confettiPopTextV1DurationFrames = 600;

/** Shared across patterns (everything except font and text) */
const confettiPopSharedV1 = {
  fontWeight: "700" as const,
  fontSize: 48,
  lineHeight: 1.2,

  textColor: "#fff8f0",

  burstFrame: 22,
  flashPeakOpacity: 0.48,
  flashDurationFrames: 6,

  glowDurationFrames: 26,

  particleCount: 96,
  showShockwaveRing: true,

  particleLifeFrames: 100,
  particleSpread: 12,
  particleGravity: 0.42,

  fadeInDuration: 8,
  delayFrames: 0,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  backgroundColor: "#1a1428",
};

export const confettiPopTextV1Patterns = {
  /** Latin script - JetBrains Mono */
  richPop: {
    ...confettiPopSharedV1,
    text: "Congratulations!",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    letterSpacing: "0.06em",
    randomSeed: "confetti-pop-rich-en",
  },

  /** Japanese - LINE Seed JP */
  richPopJp: {
    ...confettiPopSharedV1,
    text: "おめでとう！",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.08em",
    randomSeed: "confetti-pop-rich-jp",
  },
};

import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/space-grotesk";

export const defaultFlickerTitleV1Props = {
  eyebrowText: "EYEBROW LABEL",
  titleText: "Your Title Here",

  eyebrowFontSize: 24,
  titleFontSize: 48,
  gapPx: 20,

  eyebrowFontFamily: JETBRAINS_MONO_FONT_FAMILY,
  titleFontFamily: LINE_SEED_JP_FONT_FAMILY,

  eyebrowColor: "#9AA3B2",
  titleColor: "#F5F5F7",
  backgroundColor: "#0A0A0F",

  flickerTriggerFrame: 15,
};

/**
 * OneTake-specific variant of FlickerTitle.
 * Design defaults: cyan neon effect matching asami.tokyo's "Join the waitlist" button CTA.
 */
export const oneTakeLogoTextVariantProps = {
  eyebrowText: "DAW Remote Controller",
  titleText: "OneTake - Remote Control",

  eyebrowFontSize: 24,
  titleFontSize: 48,
  gapPx: 20,

  eyebrowFontFamily: JETBRAINS_MONO_FONT_FAMILY,
  titleFontFamily: SPACE_GROTESK_FONT_FAMILY,

  eyebrowColor: "#37E9FF",
  titleColor: "#EEF1FC",
  backgroundColor: "#060810",

  flickerTriggerFrame: 15,
};

/**
 * Designed for seamless looping. This duration is comfortably longer than
 * flickerTriggerFrame (15) plus one cycle of the flicker-in effect (~1.1s ≒ 33
 * frames @30fps), so both the pre-trigger state and the long-settled
 * post-trigger state render as the same "steady lit" look. That means the
 * last frame and the first frame match, and the loop plays back seamlessly.
 */
export const FLICKER_TITLE_V1_DURATION_FRAMES = 90;

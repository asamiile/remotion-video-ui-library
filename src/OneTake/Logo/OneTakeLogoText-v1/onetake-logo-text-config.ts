import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";
import { SPACE_GROTESK_FONT_FAMILY } from "../../../helpers/space-grotesk";

export const defaultOneTakeLogoTextV1Props = {
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
 * Assumes loop playback. This is well beyond flickerTriggerFrame (15) plus one
 * cycle of the lighting effect (1.1s ≈ 33 frames @ 30fps), so the state before
 * the trigger and the state well after it both settle into "always lit" —
 * meaning the last frame → first frame loop is seamless (same reasoning as
 * OnboardingConnectV1).
 */
export const ONETAKE_LOGO_TEXT_V1_DURATION_FRAMES = 90;

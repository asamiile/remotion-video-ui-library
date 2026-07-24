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
 * ループ再生前提。flickerTriggerFrame(15)+点灯演出の1周期（1.1秒≒33フレーム@30fps）より
 * 十分長く、発火前と発火後十分経過した状態がどちらも「常時点灯」で一致するため、
 * 尺の最終フレーム→先頭フレームがシームレスにループする（OnboardingConnectV1と同じ考え方）。
 */
export const ONETAKE_LOGO_TEXT_V1_DURATION_FRAMES = 90;

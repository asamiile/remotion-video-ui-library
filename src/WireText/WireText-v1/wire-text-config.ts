import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const wireTextV1DurationFrames = 320;

export const defaultWireTextV1Props = {
  text: "TRACE",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 88,
  letterSpacing: "0.06em",
  lineHeight: 1.15,

  wireColor: "#7ae2ff",
  strokeWidth: 2.2,
  wireGlowBlur: 2.4,

  fillEnabled: true,
  fillColor: "rgba(230, 248, 255, 0.92)",
  fillFadeInFrames: 18,
  fillDelayAfterDrawFrames: 6,

  drawDurationFrames: 78,
  drawEasing: "easeOut" as const,

  fadeInDuration: 12,
  delayFrames: 0,

  positionX: 50,
  positionY: 50,

  backgroundColor: "#0a1018",
};

export const wireTextV1Patterns = {
  /** 英字・細めのワイヤー */
  trace: {
    ...defaultWireTextV1Props,
    text: "WIRE TRACE",
    fontSize: 72,
    drawDurationFrames: 90,
    wireGlowBlur: 2,
  },

  /** 日本語タイトル */
  japaneseTitle: {
    ...defaultWireTextV1Props,
    text: "測定ライン",
    fontSize: 84,
    letterSpacing: "0.1em",
    drawDurationFrames: 96,
    wireColor: "#9cf0ff",
    fillColor: "rgba(220, 245, 255, 0.9)",
    wireGlowBlur: 3,
  },

  /** 輪郭のみ（塗りを実質オフ） */
  outlineOnly: {
    ...defaultWireTextV1Props,
    text: "OUTLINE ONLY",
    fontSize: 64,
    fillEnabled: false,
    wireGlowBlur: 1.5,
    strokeWidth: 2.8,
  },
};

import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const defaultLedTextV1Props = {
  text: "サンプル LED",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 80,
  cellSize: 11,
  sampleThreshold: 120,
  paddingCells: 2,

  onColor: "#ffaa33",
  offColor: "#2a1800",
  coreColor: "#fff2cc",
  dotRadiusRatio: 0.36,

  glowEnabled: true,
  glowBlur: 16,
  glowOpacity: 0.52,
  glowSpreadRatio: 1.035,

  animationMode: "static" as const,
  typewriterFramesPerColumn: 2,
  scrollPixelsPerFrame: 2.5,
  scrollGapCells: 8,

  flickerStrength: 0.06,
  randomSeed: "led-v1-default",

  fadeInDuration: 24,
  delayFrames: 6,

  positionX: 50,
  positionY: 50,

  panelBackground: "#080808",
  panelPadding: 32,
  panelBorderRadius: 16,

  scanlinesOpacity: 0.06,
};

export const ledTextV1Patterns = {
  redScroll: {
    ...defaultLedTextV1Props,
    text: "SAMPLE  ///  SCROLL  ///  TEXT  ///  ",
    fontSize: 56,
    cellSize: 9,
    animationMode: "scroll" as const,
    scrollPixelsPerFrame: 3,
    scrollGapCells: 10,
    onColor: "#ff4444",
    offColor: "#300808",
    coreColor: "#ffcccc",
  },

  redScrollJp: {
    ...defaultLedTextV1Props,
    text: "サンプル  ///  スクロール  ///  テキスト  ///  ",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 56,
    cellSize: 9,
    animationMode: "scroll" as const,
    scrollPixelsPerFrame: 3,
    scrollGapCells: 10,
    onColor: "#ff4444",
    offColor: "#300808",
    coreColor: "#ffcccc",
    randomSeed: "led-red-scroll-jp",
  },
};

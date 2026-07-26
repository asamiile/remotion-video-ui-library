// import { fontFamily as FONT_FAMILY_LINE_SEED } from "@remotion/google-fonts/LineSeedJP";
const LINESEED_FONT = "'Line Seed JP_100', sans-serif";

export const defaultLoadingIconV1Props = {
  size: 150,
  lightColor: "#DFE2D7",
  darkColor: "#6B685C",
  strokeWidth: 4,

  showText: false,
  text: "Loading (sample)…",
  textColor: "#DFE2D7",
  fontSize: 24,
  fontFamily: LINESEED_FONT,
  // fontFamily: FONT_FAMILY_LINE_SEED,
  fontWeight: "400" as const,

  positionX: 94,
  positionY: 90,

  rotationDuration: 60, // 2s (60 frames @ 30fps)
  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
};

export const loadingIconV1Patterns = {
  // Default size (100px) - no text
  default: {
    ...defaultLoadingIconV1Props,
    size: 100,
    showText: false,
  },

  // Large size (150px) - no text
  large: {
    ...defaultLoadingIconV1Props,
    size: 150,
    showText: false,
  },

  // Custom color pattern - no text
  custom: {
    ...defaultLoadingIconV1Props,
    size: 120,
    lightColor: "#FF6B9D",
    darkColor: "#C20039",
    showText: false,
  },

  // Default size (100px) - with text
  defaultWithText: {
    ...defaultLoadingIconV1Props,
    size: 100,
    showText: true,
  },

  // Large size (150px) - with text
  largeWithText: {
    ...defaultLoadingIconV1Props,
    size: 150,
    showText: true,
  },

  // Custom color pattern - with text
  customWithText: {
    ...defaultLoadingIconV1Props,
    size: 120,
    lightColor: "#FF6B9D",
    darkColor: "#C20039",
    showText: true,
  },
};

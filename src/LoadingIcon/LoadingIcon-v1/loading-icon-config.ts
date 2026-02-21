// LoadingIcon デフォルト設定
// import { fontFamily as FONT_FAMILY_LINE_SEED } from "@remotion/google-fonts/LineSeedJP";
const LINESEED_FONT = "'Line Seed JP_100', sans-serif";

export const defaultLoadingIconV1Props = {
  // アイコン設定
  size: 150,
  lightColor: "#DFE2D7",
  darkColor: "#6B685C",
  strokeWidth: 4,
  
  // テキスト設定
  showText: false,
  text: "Loading...",
  textColor: "#DFE2D7",
  fontSize: 24,
  fontFamily: LINESEED_FONT,
  // fontFamily: FONT_FAMILY_LINE_SEED,
  fontWeight: "400" as const,
  
  // 位置設定
  positionX: 94,
  positionY: 90,
  
  // アニメーション設定
  rotationDuration: 60, // 2秒（60フレーム @ 30fps）
  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
};

// LoadingIcon パターン
export const loadingIconV1Patterns = {
  // デフォルトサイズ（100px）- 文字なし
  default: {
    ...defaultLoadingIconV1Props,
    size: 100,
    showText: false,
  },
  
  // 大きいサイズ（150px）- 文字なし
  large: {
    ...defaultLoadingIconV1Props,
    size: 150,
    showText: false,
  },
  
  // カスタム色パターン - 文字なし
  custom: {
    ...defaultLoadingIconV1Props,
    size: 120,
    lightColor: "#FF6B9D",
    darkColor: "#C20039",
    showText: false,
  },
  
  // デフォルトサイズ（100px）- 文字付き
  defaultWithText: {
    ...defaultLoadingIconV1Props,
    size: 100,
    showText: true,
  },
  
  // 大きいサイズ（150px）- 文字付き
  largeWithText: {
    ...defaultLoadingIconV1Props,
    size: 150,
    showText: true,
  },
  
  // カスタム色パターン - 文字付き
  customWithText: {
    ...defaultLoadingIconV1Props,
    size: 120,
    lightColor: "#FF6B9D",
    darkColor: "#C20039",
    showText: true,
  },
};

export const defaultScanLineV1Props = {
  scanColor: "#37E9FF",
  bandHeight: 160,

  scanStyle: "clean" as const,

  scanPeriodFrames: 150,
};

/**
 * scanStyle違いのプリセット。各コンポジションの尺は自身の`scanPeriodFrames`と
 * 一致させる（シームレスループ前提、Root.tsxでdurationInFramesに直接渡す）。
 */
export const scanLineV1Patterns = {
  // 単色のグロー帯がスイープするだけの素直な捜査線
  clean: {
    ...defaultScanLineV1Props,
    scanStyle: "clean" as const,
  },

  // 画面全体のラスター線＋電子ビームの走査帯によるブラウン管テレビ風のスキャン。
  // 色はOneTakeの本文テキスト色（--color-onetake-text）に合わせている。
  crt: {
    ...defaultScanLineV1Props,
    scanStyle: "crt" as const,
    scanColor: "#EEF1FC",
    bandHeight: 60,
  },
};

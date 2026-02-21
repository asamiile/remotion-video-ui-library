// AudioSpectrum デフォルト設定

export const defaultAudioSpectrumProps = {
  audioOffsetInSeconds: 0,
  
  // スペクトラム表示設定
  barCount: 32,
  barColor: "#DFE2D7",
  barWidth: 12,
  barGap: 2,
  
  // アニメーション設定
  sensitivity: 1,
  smoothing: 0.85,
  
  // 位置設定
  positionX: 84,
  positionY: 10,
};

export const audioSpectrumPatterns = {
  // シンプル
  simple: {
    ...defaultAudioSpectrumProps,
    barCount: 16,
  },
  
  // 詳細
  detailed: {
    ...defaultAudioSpectrumProps,
    barCount: 32,
    barWidth: 12,
    barGap: 2,
  },
};

// オーディオファイル設定
// ファイルはpublic/audio/AudioSpectrum に格納する
export const audioSpectrumAudioFiles = [
  {
    id: "dialogue",
    filename: "dialogue.wav",
  },
  // 追加例:
  // {
  //   id: "music",
  //   filename: "music.wav",
  // },
];

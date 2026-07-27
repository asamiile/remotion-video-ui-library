export const defaultAudioSpectrumV1Props = {
  audioOffsetInSeconds: 0,

  barCount: 32,
  barColor: "#DFE2D7",
  barWidth: 12,
  barGap: 2,

  sensitivity: 1,
  smoothing: 0.85,

  positionX: 84,
  positionY: 10,
};

export const audioSpectrumV1Patterns = {
  simple: {
    ...defaultAudioSpectrumV1Props,
    barCount: 16,
  },

  detailed: {
    ...defaultAudioSpectrumV1Props,
    barCount: 32,
    barWidth: 12,
    barGap: 2,
  },
};

// Audio files are expected under public/audio/AudioSpectrum
export const audioSpectrumAudioFilesV1 = [
  {
    id: "dialogue",
    filename: "dialogue.wav",
  },
  // Example of an additional entry:
  // {
  //   id: "music",
  //   filename: "music.wav",
  // },
];

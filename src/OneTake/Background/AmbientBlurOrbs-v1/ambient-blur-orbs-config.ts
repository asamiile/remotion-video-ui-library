export const defaultAmbientBlurOrbsV1Props = {
  topLeftColor: "#37E9FF",
  bottomRightColor: "#FF3D9E",
  orbOpacity: 0.24,
  blurPx: 100,

  driftPeriodFrames: 420,
};

/** シームレスループ前提。driftPeriodFrames(420)と一致（1周期=14秒@30fps、asami.tokyoの`glow-drift`と同じ）。 */
export const AMBIENT_BLUR_ORBS_V1_DURATION_FRAMES = 420;

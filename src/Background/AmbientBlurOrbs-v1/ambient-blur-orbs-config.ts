export const defaultAmbientBlurOrbsV1Props = {
  topLeftColor: "#37E9FF",
  bottomRightColor: "#FF3D9E",
  orbOpacity: 0.24,
  blurPx: 100,

  driftPeriodFrames: 420,
};

/** Assumes a seamless loop; matches driftPeriodFrames (420) — one cycle = 14s @ 30fps, same as asami.tokyo's `glow-drift`. */
export const AMBIENT_BLUR_ORBS_V1_DURATION_FRAMES = 420;

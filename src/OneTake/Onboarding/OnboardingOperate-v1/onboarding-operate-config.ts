export const defaultOnboardingOperateV1Props = {
  recordColor: "#FF3D9E",
  backgroundColor: "#060810",
  vignetteOpacity: 0.45,

  tapFrame: 20,
  resetStartFrame: 65,
};

/** Assumes a seamless loop. From resetStartFrame to the end, the waveform/glow
 *  decay to the idle state, so the last frame nearly matches the first frame
 *  (idle state). */
export const ONBOARDING_OPERATE_V1_DURATION_FRAMES = 90;

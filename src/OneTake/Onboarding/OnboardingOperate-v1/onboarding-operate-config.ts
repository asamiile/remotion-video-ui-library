export const defaultOnboardingOperateV1Props = {
  recordColor: "#FF3D9E",
  backgroundColor: "#060810",
  vignetteOpacity: 0.45,

  tapFrame: 20,
  resetStartFrame: 65,
};

/** シームレスループ前提。resetStartFrame〜終端で波形/グローが待機状態まで減衰し、
 *  最終フレームが先頭フレーム（待機状態）とほぼ一致するようにしている。 */
export const ONBOARDING_OPERATE_V1_DURATION_FRAMES = 90;

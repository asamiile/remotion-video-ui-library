export const defaultOnboardingConnectV1Props = {
  phoneColor: "#37E9FF",
  laptopColor: "#9C7BFF",
  backgroundColor: "#060810",
  vignetteOpacity: 0.45,

  pulsePeriodFrames: 45,
  flickerTriggerFrame: 6,
};

/** シームレスループ前提。pulsePeriodFrames(45)の整数倍（2周期=3秒@30fps）。 */
export const ONBOARDING_CONNECT_V1_DURATION_FRAMES = 90;

export const defaultOnboardingConnectV1Props = {
  phoneColor: "#37E9FF",
  laptopColor: "#9C7BFF",
  backgroundColor: "#060810",
  vignetteOpacity: 0.45,

  pulsePeriodFrames: 45,
  flickerTriggerFrame: 6,
};

/** Assumes a seamless loop; an integer multiple of pulsePeriodFrames (45) — 2 cycles = 3s @ 30fps. */
export const ONBOARDING_CONNECT_V1_DURATION_FRAMES = 90;

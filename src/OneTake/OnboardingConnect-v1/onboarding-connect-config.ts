export const defaultOnboardingConnectV1Props = {
  phoneColor: "#37E9FF",
  laptopColor: "#9C7BFF",
  backgroundColor: "#060810",
  vignetteOpacity: 0.45,

  pulsePhaseFrames: 60,
  pulsePeriodFrames: 45,

  fadeInDuration: 15,
};

/** Step 1 (Welcome) 用: パルスが往復するだけのループ区間だけを使う想定。 */
export const ONBOARDING_CONNECT_V1_LOOP_END_FRAME = 60;

/** Step 2 (Connect) 用: パルス→点灯フリッカー→常時点灯まで通しで使う想定。 */
export const ONBOARDING_CONNECT_V1_DURATION_FRAMES = 105;

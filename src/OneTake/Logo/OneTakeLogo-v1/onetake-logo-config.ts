/**
 * `OnboardingOperateV1`の波形バー（`WaveformBars`）が4フレームごとに新しい値へ切り替わる
 * 速さに合わせたテンポ。1サイクル（4フレーム相当の1/4周期）×4=16フレームとしている。
 */
const WAVE_PERIOD_FRAMES_MATCHING_ONBOARDING_OPERATE = 16;

/** 1周期再生後に静止させる長さ（1秒@30fps）。 */
const HOLD_FRAMES_ONE_SECOND = 15;

export const defaultOneTakeLogoV1Props = {
  barColorTop: "#EAFEFF",
  barColorBottom: "#37E9FF",
  backgroundColor: "#060810",

  wavePeriodFrames: WAVE_PERIOD_FRAMES_MATCHING_ONBOARDING_OPERATE,
  waveAmplitude: 0.22,
  motionCyclesBeforeHold: 1,
  holdFrames: 0,
};

/**
 * プリセット。各コンポジションの尺は自身の
 * `wavePeriodFrames * motionCyclesBeforeHold + holdFrames`と一致させる
 * （シームレスループ前提、Root.tsxでdurationInFramesに直接渡す）。
 */
export const oneTakeLogoV1Patterns = {
  // 左→右へ位相がずれ、波が伝っていくように見える。2周期再生後、1秒静止してから繰り返す。
  wave: {
    ...defaultOneTakeLogoV1Props,
    waveAmplitude: 0.22,
    motionCyclesBeforeHold: 2,
    holdFrames: HOLD_FRAMES_ONE_SECOND,
  },
};

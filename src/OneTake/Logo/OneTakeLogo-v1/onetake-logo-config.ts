/**
 * `OnboardingOperateV1`の波形バー（`WaveformBars`）が4フレームごとに新しい値へ切り替わる
 * 速さに合わせたテンポ。1サイクル（4フレーム相当の1/4周期）×4=16フレームとしている。
 */
const WAVE_PERIOD_FRAMES_MATCHING_ONBOARDING_OPERATE = 16;

/**
 * chase用のテンポ。参照アニメーション（`public/sownd wave.svg`、4バー・1周期1.101s≒33フレーム@30fps）
 * を、このロゴのバー数（5本）に合わせて比例配分した値（33 × 5/4 ≒ 41 → 40に丸め）。
 */
const CHASE_WAVE_PERIOD_FRAMES = 40;

/** 1周期再生後に静止させる長さ（1秒@30fps）。 */
const HOLD_FRAMES_ONE_SECOND = 15;

export const defaultOneTakeLogoV1Props = {
  barColorTop: "#EAFEFF",
  barColorBottom: "#37E9FF",
  backgroundColor: "#060810",

  pulseStyle: "wave" as const,
  wavePeriodFrames: WAVE_PERIOD_FRAMES_MATCHING_ONBOARDING_OPERATE,
  waveAmplitude: 0.22,
  motionCyclesBeforeHold: 1,
  holdFrames: 0,
};

/**
 * pulseStyle違いのプリセット。各コンポジションの尺は自身の
 * `wavePeriodFrames * motionCyclesBeforeHold + holdFrames`と一致させる
 * （シームレスループ前提、Root.tsxでdurationInFramesに直接渡す）。
 */
export const oneTakeLogoV1Patterns = {
  // 全バーが揃って呼吸するように拡縮する、素直なパルス
  sync: {
    ...defaultOneTakeLogoV1Props,
    pulseStyle: "sync" as const,
    waveAmplitude: 0.18,
  },

  // 左→右へ位相がずれ、波が伝っていくように見える。2周期再生後、1秒静止してから繰り返す。
  wave: {
    ...defaultOneTakeLogoV1Props,
    pulseStyle: "wave" as const,
    waveAmplitude: 0.22,
    motionCyclesBeforeHold: 2,
    holdFrames: HOLD_FRAMES_ONE_SECOND,
  },

  // 中央バーを起点に外側へ位相がずれ、中心から広がるように見える
  centerOut: {
    ...defaultOneTakeLogoV1Props,
    pulseStyle: "centerOut" as const,
    waveAmplitude: 0.25,
  },

  // 奇数/偶数バーが逆位相で交互に拡縮する
  alternate: {
    ...defaultOneTakeLogoV1Props,
    pulseStyle: "alternate" as const,
    waveAmplitude: 0.2,
  },

  // 左のバーから右のバーへ順々に、素早く最大高さまで伸びてゆっくり戻る
  chase: {
    ...defaultOneTakeLogoV1Props,
    pulseStyle: "chase" as const,
    wavePeriodFrames: CHASE_WAVE_PERIOD_FRAMES,
    waveAmplitude: 0.82,
  },
};

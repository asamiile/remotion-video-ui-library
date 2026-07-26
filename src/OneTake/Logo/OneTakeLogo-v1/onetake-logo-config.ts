/**
 * Tempo matched to `OnboardingOperateV1`'s waveform bars (`WaveformBars`),
 * which switch to a new value every 4 frames. Set to 4 frames per
 * quarter-cycle × 4 = 16 frames for one full cycle.
 */
const WAVE_PERIOD_FRAMES_MATCHING_ONBOARDING_OPERATE = 16;

/** How long to hold still after one cycle finishes (1s @ 30fps). */
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
 * Presets. Each composition's duration must match its own
 * `wavePeriodFrames * motionCyclesBeforeHold + holdFrames` (assumes a
 * seamless loop; passed directly to durationInFrames in Root.tsx).
 */
export const oneTakeLogoV1Patterns = {
  // Phase shifts left-to-right so the wave appears to travel across. Plays 2 cycles, holds for 1s, then repeats.
  wave: {
    ...defaultOneTakeLogoV1Props,
    waveAmplitude: 0.22,
    motionCyclesBeforeHold: 2,
    holdFrames: HOLD_FRAMES_ONE_SECOND,
  },
};

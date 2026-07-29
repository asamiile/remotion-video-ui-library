import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const oneTakeLogoSchemaV1 = z.object({
  barColorTop: zColor().default("#EAFEFF"),
  barColorBottom: zColor().default("#37E9FF"),
  backgroundColor: zColor().default("#060810"),

  /** Frames for one full wave cycle. Assumes a seamless loop when embedded in
   *  the app, so the composition's total duration must match
   *  wavePeriodFrames*motionCyclesBeforeHold+holdFrames. */
  wavePeriodFrames: z.number().min(10).default(90),
  /** Amplitude of each bar's height swing (1 = swings by 100% of height) */
  waveAmplitude: z.number().min(0).max(1).default(0.22),
  /** Number of cycles played before holding still (e.g. 2 means play 2 full cycles, then hold) */
  motionCyclesBeforeHold: z.number().min(1).default(1),
  /** Frames to hold still after the given number of cycles, before the next
   *  playback starts. Since frame=0 and frame=wavePeriodFrames*N are
   *  mathematically identical poses, holding at the frame=0 pose throughout
   *  this period still loops seamlessly. */
  holdFrames: z.number().min(0).default(0),
});

export type OneTakeLogoSchemaV1Type = z.infer<typeof oneTakeLogoSchemaV1>;

const WAVE_PERIOD_FRAMES_MATCHING_ONBOARDING_OPERATE = 16;
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
export const oneTakeLogoV1Patterns = {
  // Phase shifts left-to-right so the wave appears to travel across. Plays 2 cycles, holds for 1s, then repeats.
  wave: {
    ...defaultOneTakeLogoV1Props,
    waveAmplitude: 0.22,
    motionCyclesBeforeHold: 2,
    holdFrames: HOLD_FRAMES_ONE_SECOND,
  },
};

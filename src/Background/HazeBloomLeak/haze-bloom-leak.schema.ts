import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { ambientElectronicPalette as P } from "../../helpers/palette-ambient-electronic";
import { defaultTempo, tempoFields, tempoLoopFrames, tempoPresets } from "../../helpers/tempo";

export const HAZE_BLOOM_LEAK_STYLES = ["edge", "corner", "haze", "sweep", "top", "streak"] as const;

/**
 * Slow light leaks for music videos. Renders over black for Screen / Add
 * blending in an editor; `--transparent-bg` gives a premultiplied alpha
 * version instead. See .agents/design/ambient-electronic.md.
 */
export const hazeBloomLeakSchema = z.object({
  /**
   * edge = leaks bleeding in from the left (warm) and right (cool) edges;
   * corner = diagonal leaks from the top-left and bottom-right corners;
   * haze = a low-contrast colored fog drifting over the whole frame;
   * sweep = a tilted burn band crossing the frame once per breath;
   * top = two washes falling from above like stage light;
   * streak = an anamorphic horizontal line with a warm hot spot
   */
  style: z.enum(HAZE_BLOOM_LEAK_STYLES),
  /** Warm leak (left / top-left) */
  colorA: zColor(),
  /** Cool leak (right / bottom-right) */
  colorB: zColor(),
  /** Hot core where a leak burns out */
  colorC: zColor(),
  /** Overall brightness */
  intensity: z.number().min(0).max(2),
  /** Leak size multiplier */
  spread: z.number().min(0.5).max(2),
  /** Bars per breath; warm and cool leaks swell in turn */
  breathBars: z.number().int().min(1).max(16),
  /** Swell on every beat, 0 = off */
  kick: z.number().min(0).max(1),
  /** Film grain on the light */
  grain: z.number().min(0).max(1),
  ...tempoFields,
  randomSeed: z.number().int().min(0).max(999),
  /** Black for Screen blending; made transparent by --transparent-bg */
  backgroundColor: zColor(),
});

export type HazeBloomLeakSchemaType = z.infer<typeof hazeBloomLeakSchema>;

export const hazeBloomLeakDurationFrames = tempoLoopFrames;

const base = {
  colorA: P.coral,
  colorB: P.sky,
  colorC: P.white,
  intensity: 1,
  spread: 1,
  breathBars: 4,
  kick: 0.2,
  grain: 0.4,
  ...defaultTempo,
  randomSeed: 3,
  backgroundColor: "#000000",
} as const;

export const hazeBloomLeakPatterns: Record<string, HazeBloomLeakSchemaType> = {
  /** Coral from the left, sky from the right, swelling in turn */
  edgeDuo: { ...base, style: "edge" },
  /** Coral from both edges */
  edgeWarm: { ...base, style: "edge", colorB: P.coral, randomSeed: 11 },
  /** Soft white leaks, no color */
  edgeMono: { ...base, style: "edge", colorA: P.white, colorB: P.white, intensity: 0.7, randomSeed: 19 },
  /** Coral top-left, sky bottom-right */
  cornerDuo: { ...base, style: "corner", randomSeed: 23 },
  /** Sky from both corners */
  cornerCool: { ...base, style: "corner", colorA: P.sky, randomSeed: 29, kick: 0.1 },
  /** Coral and sky fog drifting across the frame */
  hazeDuo: { ...base, style: "haze", intensity: 0.8, kick: 0.1, randomSeed: 31 },
  /** Sky from both edges */
  edgeCool: { ...base, style: "edge", colorA: P.sky, randomSeed: 37 },
  /** Coral from both corners */
  cornerWarm: { ...base, style: "corner", colorB: P.coral, randomSeed: 41 },
  /** White fog */
  hazeMono: { ...base, style: "haze", colorA: P.white, colorB: P.white, intensity: 0.6, kick: 0.1, randomSeed: 43 },
  /** Coral fog */
  hazeWarm: { ...base, style: "haze", colorB: P.coral, intensity: 0.8, kick: 0.1, randomSeed: 47 },
  /** Heavy grain, slow breath, dub-techno tempo */
  edgeGrainy: { ...base, ...tempoPresets.dubTechno, style: "edge", grain: 1, intensity: 0.85, breathBars: 8, kick: 0.1, randomSeed: 53 },
  /** Burn band sweeping across every 4 bars, coral leading, sky trailing */
  sweepDuo: { ...base, style: "sweep", randomSeed: 59 },
  /** Coral burn band */
  sweepWarm: { ...base, style: "sweep", colorB: P.coral, randomSeed: 61 },
  /** Coral and sky stage washes from above */
  topDuo: { ...base, style: "top", randomSeed: 67 },
  /** White washes from above */
  topMono: { ...base, style: "top", colorA: P.white, colorB: P.white, intensity: 0.75, randomSeed: 71 },
  /** Sky anamorphic streak */
  streakCool: { ...base, style: "streak", colorA: P.white, randomSeed: 73 },
  /** Sky streak with a coral hot spot */
  streakDuo: { ...base, style: "streak", randomSeed: 79 },
  /** Section set, intro: faint edges, 8-bar breath, no kick */
  sectionIntro: { ...base, style: "edge", intensity: 0.6, breathBars: 8, kick: 0, randomSeed: 83 },
  /** Section set, build: corners breathing every 2 bars */
  sectionBuild: { ...base, style: "corner", intensity: 0.9, breathBars: 2, kick: 0.3, randomSeed: 89 },
  /** Section set, drop: bright edges breathing every bar, strong kick */
  sectionDrop: { ...base, style: "edge", intensity: 1.3, breathBars: 1, kick: 0.6, randomSeed: 97 },
  /** Section set, breakdown: grainy fog, 8-bar breath */
  sectionBreakdown: { ...base, style: "haze", intensity: 0.6, breathBars: 8, kick: 0, grain: 0.6, randomSeed: 101 },
};

/** 1080x1920 versions (IDs: Background-HazeBloomLeak-Vertical*). */
export const hazeBloomLeakVerticalPatterns: Record<string, HazeBloomLeakSchemaType> = {
  verticalEdgeDuo: { ...base, style: "edge", spread: 0.8 },
  verticalTopDuo: { ...base, style: "top", spread: 0.6, intensity: 0.8, randomSeed: 67 },
  verticalStreakDuo: { ...base, style: "streak", randomSeed: 79 },
  verticalSweepDuo: { ...base, style: "sweep", randomSeed: 59 },
};

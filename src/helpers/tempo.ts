import { z } from "zod";

/**
 * Tempo-synced loops for music-video overlays. A loop is a whole number of
 * bars, so beat-driven motion (`phase * beatsPerLoop`) repeats seamlessly and
 * lines up with the track once `offsetMs` matches its first downbeat.
 */

export const BEATS_PER_BAR = 4;

export const tempoFields = {
  /** Track tempo */
  bpm: z.number().min(60).max(180),
  /** Loop length in bars (4 beats each) */
  bars: z.number().int().min(1).max(64),
  /** Shifts the beat grid; positive = beats land later */
  offsetMs: z.number().min(-2000).max(2000),
};

export type TempoProps = {
  bpm: number;
  bars: number;
  offsetMs: number;
};

export const defaultTempo = { bpm: 122, bars: 8, offsetMs: 0 } as const;

/** Typical tempos; spread into a pattern in place of defaultTempo. */
export const tempoPresets = {
  dubTechno: { bpm: 118, bars: 8, offsetMs: 0 },
  melodicHouse: { bpm: 124, bars: 8, offsetMs: 0 },
} as const;

export const tempoLoopFrames = ({ bpm, bars }: Pick<TempoProps, "bpm" | "bars">, fps = 30) =>
  Math.max(1, Math.round(((bars * BEATS_PER_BAR * 60) / bpm) * fps));

export const beatsPerLoop = ({ bars }: Pick<TempoProps, "bars">) => bars * BEATS_PER_BAR;

/** Beat position in [0, beatsPerLoop) for a frame, wrapping with the loop. */
export const beatAtFrame = (
  frame: number,
  durationInFrames: number,
  { bars, bpm, offsetMs }: TempoProps,
) => {
  const total = beatsPerLoop({ bars });
  const beat = (frame / durationInFrames) * total - (offsetMs / 1000) * (bpm / 60);
  return ((beat % total) + total) % total;
};

/** Number of whole `cycleBars` cycles that fit the loop (at least 1), so cycles loop seamlessly. */
export const cyclesPerLoop = (bars: number, cycleBars: number) =>
  Math.max(1, Math.round(bars / Math.max(1, cycleBars)));

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const WAVE_SHAPES_WAVEFORMS = ["sine", "square", "triangle", "sawtooth", "composite"] as const;
/** `waveform: "morph"` blends through these; the lineup always shows the five basic shapes. */
export const WAVE_SHAPES_MORPH_SHAPES = ["sine", "triangle", "square", "sawtooth"] as const;
export const WAVE_SHAPES_LAYOUTS = ["single", "lineup"] as const;

/** One sine partial of the composite wave. */
const partialSchema = z.object({
  /** Multiple of the fundamental frequency */
  harmonic: z.number().int().min(1).max(16),
  amplitude: z.number().min(0).max(1),
  /** Starting phase, 0-1 of a cycle */
  phase: z.number().min(0).max(1),
  /** Whole cycles the phase drifts per loop, so the shape morphs and still loops */
  drift: z.number().int().min(-4).max(4),
});

export type WaveShapesPartial = z.infer<typeof partialSchema>;

/**
 * The five basic oscillator shapes drawn large in a single hairline over
 * black. Each pattern is a seamless loop: the wave scrolls whole cycles and
 * the composite partials drift whole cycles per loop.
 */
export const waveShapesSchema = z.object({
  /**
   * sine / square / triangle / sawtooth / composite (sum of `partials`) /
   * morph (blends through `morphShapes` once per loop)
   */
  waveform: z.enum([...WAVE_SHAPES_WAVEFORMS, "morph"]),
  /** single = one large wave; lineup = all five shapes stacked, top to bottom */
  layout: z.enum(WAVE_SHAPES_LAYOUTS),
  /** Composite wave recipe */
  partials: z.array(partialSchema).min(1).max(8),
  /** Morph only: shapes visited in order, wrapping back to the first */
  morphShapes: z.array(z.enum(WAVE_SHAPES_MORPH_SHAPES)).min(2).max(8),
  /** Morph only: share of each step spent holding the shape before blending on */
  morphHold: z.number().min(0).max(0.9),
  /** Morph only: harmonics in the blend; more = crisper edges */
  morphHarmonics: z.number().int().min(4).max(64),
  /** Wavelengths visible across the frame width */
  cycles: z.number().min(0.25).max(16),
  /** Peak height, % of the frame (lineup: % of each row) */
  amplitude: z.number().min(1).max(50),
  /** Whole cycles scrolled per loop; negative scrolls right to left */
  scrollCycles: z.number().int().min(-16).max(16),
  /** Frequency sweep range in octaves around the frame center, 0 = fixed wavelength */
  sweepOctaves: z.number().min(0).max(3),
  /** Frequency sweeps (out and back) per loop */
  sweepCycles: z.number().int().min(1).max(8),
  /** Oscilloscope trace: left-to-right beam sweeps per loop, 0 = full line */
  traceSweeps: z.number().int().min(0).max(30),
  /** Trace afterglow length, share of the frame width behind the beam */
  tracePersistence: z.number().min(0.05).max(1),
  /** Amplitude breathing depth, 0 = steady */
  breath: z.number().min(0).max(1),
  /** Breaths per loop */
  breathCycles: z.number().int().min(1).max(8),
  /** Fading copies trailing the main line */
  echoCount: z.number().int().min(0).max(16),
  /** Phase lag between copies, fraction of a cycle */
  echoSpread: z.number().min(0).max(0.5),
  /** Composite only: draw each partial as a faint line behind the sum */
  showPartials: z.boolean(),
  /** Stroke width in pixels */
  lineWidth: z.number().min(0.5).max(40),
  /** Soft halo around the line, 0 = none */
  glow: z.number().min(0).max(1),
  /** Center axis and oscilloscope grid opacity, 0 = none */
  gridOpacity: z.number().min(0).max(1),
  /** Vertical center, % of the frame height */
  centerY: z.number().min(0).max(100),
  lineColor: zColor(),
  /** Black by default; made transparent by --transparent-bg */
  backgroundColor: zColor(),
});

export type WaveShapesSchemaType = z.infer<typeof waveShapesSchema>;

export const waveShapesDurationFrames = 300;

/** Fundamental plus odd and even overtones, slowly sliding against each other. */
const defaultPartials: WaveShapesPartial[] = [
  { harmonic: 1, amplitude: 1, phase: 0, drift: 0 },
  { harmonic: 2, amplitude: 0.45, phase: 0.25, drift: 1 },
  { harmonic: 3, amplitude: 0.3, phase: 0.6, drift: -1 },
  { harmonic: 5, amplitude: 0.18, phase: 0.1, drift: 2 },
];

const defaultMorphShapes: WaveShapesSchemaType["morphShapes"] = [...WAVE_SHAPES_MORPH_SHAPES];
const sineSquareShapes: WaveShapesSchemaType["morphShapes"] = ["sine", "square"];

const base = {
  layout: "single",
  partials: defaultPartials,
  morphShapes: defaultMorphShapes,
  morphHold: 0.4,
  morphHarmonics: 32,
  cycles: 2,
  amplitude: 32,
  scrollCycles: 2,
  sweepOctaves: 0,
  sweepCycles: 1,
  traceSweeps: 0,
  tracePersistence: 0.6,
  breath: 0,
  breathCycles: 1,
  echoCount: 0,
  echoSpread: 0.04,
  showPartials: false,
  lineWidth: 6,
  glow: 0.35,
  gridOpacity: 0,
  centerY: 50,
  lineColor: "#ffffff",
  backgroundColor: "#000000",
} as const;

export const waveShapesPatterns: Record<string, WaveShapesSchemaType> = {
  /** Two large sine cycles scrolling left */
  sine: { ...base, waveform: "sine" },
  /** Square wave with hard vertical edges */
  square: { ...base, waveform: "square" },
  /** Triangle wave with sharp corners */
  triangle: { ...base, waveform: "triangle" },
  /** Rising sawtooth ramps */
  sawtooth: { ...base, waveform: "sawtooth" },
  /** Four-partial composite, the shape morphing as the partials drift */
  composite: { ...base, waveform: "composite" },
  /** Composite with its partials drawn faintly behind the sum */
  compositePartials: { ...base, waveform: "composite", showPartials: true },
  /** One slow sine filling the frame, breathing */
  sineSwell: { ...base, waveform: "sine", cycles: 1, amplitude: 40, scrollCycles: 1, breath: 0.5, lineWidth: 10 },
  /** Sine with a fan of fading echoes */
  sineEcho: { ...base, waveform: "sine", echoCount: 10, echoSpread: 0.025, lineWidth: 3 },
  /** Square wave on an oscilloscope grid */
  squareScope: { ...base, waveform: "square", cycles: 3, amplitude: 28, scrollCycles: 3, lineWidth: 4, gridOpacity: 0.35 },
  /** Dense triangle zigzag */
  triangleDense: { ...base, waveform: "triangle", cycles: 6, amplitude: 30, scrollCycles: 6, lineWidth: 4 },
  /** Falling sawtooth, scrolling right */
  sawtoothReverse: { ...base, waveform: "sawtooth", scrollCycles: -2 },
  /** Sawtooth with a fan of fading echoes */
  sawtoothEcho: { ...base, waveform: "sawtooth", echoCount: 8, echoSpread: 0.03, lineWidth: 3 },
  /** Composite of high partials only, a busy timbre */
  compositeBright: {
    ...base,
    waveform: "composite",
    cycles: 1.5,
    scrollCycles: 1,
    partials: [
      { harmonic: 1, amplitude: 1, phase: 0, drift: 0 },
      { harmonic: 4, amplitude: 0.4, phase: 0.3, drift: 1 },
      { harmonic: 7, amplitude: 0.25, phase: 0.7, drift: -2 },
      { harmonic: 11, amplitude: 0.15, phase: 0.2, drift: 3 },
    ],
  },
  /** Beating: two near-unison partials on a grid */
  compositeBeat: {
    ...base,
    waveform: "composite",
    cycles: 1,
    amplitude: 38,
    scrollCycles: 1,
    lineWidth: 3,
    gridOpacity: 0.3,
    partials: [
      { harmonic: 8, amplitude: 1, phase: 0, drift: 0 },
      { harmonic: 9, amplitude: 1, phase: 0, drift: 1 },
    ],
  },
  /** Sine to triangle to square to sawtooth and back, harmonics fading in and out */
  morph: { ...base, waveform: "morph" },
  /** Morph held still on a scope grid */
  morphScope: { ...base, waveform: "morph", scrollCycles: 0, lineWidth: 4, gridOpacity: 0.3, morphHold: 0.3 },
  /** Sine to square and back only */
  morphSineSquare: { ...base, waveform: "morph", morphShapes: sineSquareShapes, morphHold: 0.25 },
  /** Oscilloscope beam tracing a sine, phosphor afterglow behind it */
  traceSine: { ...base, waveform: "sine", scrollCycles: 0, traceSweeps: 5, lineWidth: 4, gridOpacity: 0.3 },
  /** Beam tracing a square wave */
  traceSquare: { ...base, waveform: "square", cycles: 3, scrollCycles: 0, traceSweeps: 5, lineWidth: 4, gridOpacity: 0.3 },
  /** Beam tracing the morphing composite */
  traceComposite: { ...base, waveform: "composite", scrollCycles: 0, traceSweeps: 4, tracePersistence: 0.8, lineWidth: 4, gridOpacity: 0.3 },
  /** Beam tracing the shape morph */
  traceMorph: { ...base, waveform: "morph", scrollCycles: 0, traceSweeps: 8, tracePersistence: 0.8, lineWidth: 4, gridOpacity: 0.3 },
  /** Sine stretching and compressing over two octaves */
  sweepSine: { ...base, waveform: "sine", cycles: 1, sweepOctaves: 2, scrollCycles: 1 },
  /** Square wave frequency sweep */
  sweepSquare: { ...base, waveform: "square", cycles: 1.5, sweepOctaves: 1.5, scrollCycles: 1 },
  /** Sawtooth sweeping out and back twice per loop */
  sweepSawtooth: { ...base, waveform: "sawtooth", cycles: 1.5, sweepOctaves: 1, sweepCycles: 2, scrollCycles: 2 },
  /** Morph and frequency sweep together */
  sweepMorph: { ...base, waveform: "morph", cycles: 1, sweepOctaves: 1.5, scrollCycles: 1 },
  /** All five shapes stacked: sine, square, triangle, sawtooth, composite */
  lineup: { ...base, waveform: "sine", layout: "lineup", cycles: 4, amplitude: 34, scrollCycles: 2, lineWidth: 4 },
  /** Lineup on oscilloscope grids */
  lineupScope: { ...base, waveform: "sine", layout: "lineup", cycles: 4, amplitude: 34, scrollCycles: 2, lineWidth: 3, gridOpacity: 0.3 },
  /** Lineup traced by one beam sweeping all five rows */
  lineupTrace: { ...base, waveform: "sine", layout: "lineup", cycles: 4, amplitude: 34, scrollCycles: 0, traceSweeps: 5, lineWidth: 3, gridOpacity: 0.3 },
};

/** 1080x1920 versions (IDs: Background-WaveShapes-Vertical*). */
export const waveShapesVerticalPatterns: Record<string, WaveShapesSchemaType> = {
  verticalSine: { ...base, waveform: "sine", cycles: 1, amplitude: 28, scrollCycles: 1 },
  verticalSquare: { ...base, waveform: "square", cycles: 1, amplitude: 28, scrollCycles: 1 },
  verticalTriangle: { ...base, waveform: "triangle", cycles: 1, amplitude: 28, scrollCycles: 1 },
  verticalSawtooth: { ...base, waveform: "sawtooth", cycles: 1, amplitude: 28, scrollCycles: 1 },
  verticalComposite: { ...base, waveform: "composite", cycles: 1, amplitude: 28, scrollCycles: 1 },
  verticalMorph: { ...base, waveform: "morph", cycles: 1, amplitude: 28, scrollCycles: 1 },
  verticalTraceSine: { ...base, waveform: "sine", cycles: 1, amplitude: 28, scrollCycles: 0, traceSweeps: 5, lineWidth: 4, gridOpacity: 0.3 },
  verticalSweepSine: { ...base, waveform: "sine", cycles: 0.75, amplitude: 28, sweepOctaves: 1.5, scrollCycles: 1 },
  verticalLineup: { ...base, waveform: "sine", layout: "lineup", cycles: 2, amplitude: 34, scrollCycles: 1, lineWidth: 4 },
};

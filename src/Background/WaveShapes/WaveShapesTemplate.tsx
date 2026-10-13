import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import {
  WAVE_SHAPES_WAVEFORMS,
  type WaveShapesPartial,
  type WaveShapesSchemaType,
} from "./wave-shapes.schema";

type Waveform = WaveShapesSchemaType["waveform"];
type MorphShape = WaveShapesSchemaType["morphShapes"][number];

const TAU = Math.PI * 2;
/** Uniform sample spacing in pixels; corners and edges are added exactly on top. */
const SAMPLE_STEP = 3;
/** Phase offset used to take the left / right limit at a discontinuity */
const EPS = 1e-7;
/** Morph: how far the highest harmonic lags the fundamental, share of the blend */
const MORPH_STAGGER = 0.6;
/** Gradient stops used to fade the trace afterglow */
const TRACE_STOPS = 48;

const frac = (p: number) => p - Math.floor(p);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smoothstep = (x: number) => x * x * (3 - 2 * x);

const partialAt = (k: WaveShapesPartial, p: number, t: number) =>
  Math.sin(TAU * (k.harmonic * p + k.phase + k.drift * t));

/** Sine-series coefficient of harmonic k, phase-aligned so every shape shares the fundamental. */
const fourierCoefficient = (shape: MorphShape, k: number) => {
  const odd = k % 2 === 1;
  switch (shape) {
    case "sine":
      return k === 1 ? 1 : 0;
    case "square":
      return odd ? 4 / (Math.PI * k) : 0;
    case "triangle":
      return odd ? ((8 / (Math.PI * Math.PI * k * k)) * (k % 4 === 1 ? 1 : -1)) : 0;
    case "sawtooth":
      return (2 / (Math.PI * k)) * (odd ? 1 : -1);
  }
};

/**
 * Harmonic amplitudes of the morph at loop progress t: hold each shape, then
 * blend to the next with higher harmonics arriving later, like a filter sweep.
 * Lanczos sigma factors tame the ringing at the edges.
 */
const morphCoefficients = ({ morphShapes, morphHold, morphHarmonics }: WaveShapesSchemaType, t: number) => {
  const n = morphShapes.length;
  const step = t * n;
  const from = morphShapes[Math.floor(step) % n];
  const to = morphShapes[(Math.floor(step) + 1) % n];
  const blend = clamp01((frac(step) - morphHold) / (1 - morphHold));
  return Array.from({ length: morphHarmonics }, (_, i) => {
    const k = i + 1;
    const lag = morphHarmonics > 1 ? (MORPH_STAGGER * i) / (morphHarmonics - 1) : 0;
    const u = smoothstep(clamp01(blend * (1 + MORPH_STAGGER) - lag));
    const sigma = k === 1 ? 1 : Math.sin((Math.PI * k) / (morphHarmonics + 1)) / ((Math.PI * k) / (morphHarmonics + 1));
    const a = fourierCoefficient(from, k);
    return (a + (fourierCoefficient(to, k) - a) * u) * sigma;
  });
};

/** Waveform value (about -1..1) as a function of phase p, in cycles, at loop progress t. */
const waveFunction = (waveform: Waveform, props: WaveShapesSchemaType, t: number): ((p: number) => number) => {
  switch (waveform) {
    case "sine":
      return (p) => Math.sin(TAU * p);
    case "square":
      return (p) => (frac(p) < 0.5 ? 1 : -1);
    case "triangle":
      return (p) => 1 - 4 * Math.abs(frac(p + 0.25) - 0.5);
    case "sawtooth":
      return (p) => 2 * frac(p + 0.5) - 1;
    case "composite": {
      const { partials } = props;
      const total = partials.reduce((sum, k) => sum + k.amplitude, 0) || 1;
      return (p) => partials.reduce((sum, k) => sum + k.amplitude * partialAt(k, p, t), 0) / total;
    }
    case "morph": {
      const coefficients = morphCoefficients(props, t);
      return (p) => {
        let v = 0;
        for (let i = 0; i < coefficients.length; i++) {
          if (coefficients[i] !== 0) v += coefficients[i] * Math.sin(TAU * (i + 1) * p);
        }
        return v;
      };
    }
  }
};

/** Phases (within one cycle) of corners and jumps, sampled exactly so edges stay crisp. */
const BREAKPOINTS: Record<Waveform, number[]> = {
  sine: [],
  square: [0, 0.5],
  triangle: [0.25, 0.75],
  sawtooth: [0.5],
  composite: [],
  morph: [],
};

/** Horizontal mapping: phase p = (x - anchorX) / period + offset. */
type Geometry = { width: number; period: number; anchorX: number; offset: number; cy: number; amp: number };

const phaseAtX = (x: number, g: Geometry) => (x - g.anchorX) / g.period + g.offset;

/** SVG path of `value(p)` across the frame. */
const wavePath = (value: (p: number) => number, breakpoints: number[], g: Geometry, pad: number) => {
  const x0 = -pad;
  const x1 = g.width + pad;
  // [x, phase, order]: at a breakpoint the left limit comes before the right limit.
  const samples: [number, number, number][] = [];
  for (let x = x0; x <= x1 + SAMPLE_STEP; x += SAMPLE_STEP) {
    samples.push([x, phaseAtX(x, g), 0.5]);
  }
  if (breakpoints.length > 0) {
    const firstCycle = Math.floor(phaseAtX(x0, g)) - 1;
    const lastCycle = Math.ceil(phaseAtX(x1, g)) + 1;
    for (let c = firstCycle; c <= lastCycle; c++) {
      for (const b of breakpoints) {
        const p = c + b;
        const x = (p - g.offset) * g.period + g.anchorX;
        if (x < x0 || x > x1) continue;
        samples.push([x, p - EPS, 0], [x, p + EPS, 1]);
      }
    }
  }
  samples.sort((a, b) => a[0] - b[0] || a[2] - b[2]);
  return samples
    .map(([x, p], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${(g.cy - g.amp * value(p)).toFixed(2)}`)
    .join("");
};

type Stroke = { d: string; opacity: number; width: number; angular: boolean };

/** Main line, its echoes and (composite) its partials for one wave row, plus the beam position. */
const rowStrokes = (waveform: Waveform, props: WaveShapesSchemaType, g: Geometry, t: number, beamX: number) => {
  const { partials, echoCount, echoSpread, lineWidth, showPartials } = props;
  const angular = BREAKPOINTS[waveform].length > 0;
  const pad = lineWidth * 4;
  const value = waveFunction(waveform, props, t);
  const strokes: Stroke[] = [];

  if (waveform === "composite" && showPartials) {
    const total = partials.reduce((sum, k) => sum + k.amplitude, 0) || 1;
    for (const k of partials) {
      strokes.push({
        d: wavePath((p) => (k.amplitude * partialAt(k, p, t)) / total, [], g, pad),
        opacity: 0.32,
        width: Math.max(1, lineWidth * 0.35),
        angular: false,
      });
    }
  }

  for (let i = echoCount; i >= 1; i--) {
    strokes.push({
      d: wavePath(value, BREAKPOINTS[waveform], { ...g, offset: g.offset - i * echoSpread }, pad),
      opacity: 0.55 * (1 - i / (echoCount + 1)) ** 1.5,
      width: Math.max(1, lineWidth * 0.6),
      angular,
    });
  }

  strokes.push({ d: wavePath(value, BREAKPOINTS[waveform], g, pad), opacity: 1, width: lineWidth, angular });
  return { strokes, beam: { x: beamX, y: g.cy - g.amp * value(phaseAtX(beamX, g)) } };
};

/** Oscilloscope graticule for one row: center axis, peak guides and divisions. */
const rowGrid = (width: number, top: number, bottom: number, cy: number, amp: number, divisions: number) => {
  const lines: { d: string; opacity: number; dash?: string }[] = [
    { d: `M0 ${cy}H${width}`, opacity: 1 },
    { d: `M0 ${cy - amp}H${width}M0 ${cy + amp}H${width}`, opacity: 0.5, dash: "6 10" },
  ];
  const step = width / divisions;
  let ticks = "";
  for (let i = 1; i < divisions; i++) {
    ticks += `M${(i * step).toFixed(1)} ${top}V${bottom}`;
  }
  lines.push({ d: ticks, opacity: 0.35 });
  return lines;
};

/**
 * Afterglow behind the beam as gradient stops along x: full brightness at the
 * beam, fading to nothing `persistence` of the frame width behind it, and dark
 * ahead of it until the next sweep redraws.
 */
const traceStops = (beam01: number, persistence: number) => {
  const glowAt = (x01: number) => {
    const age = frac(beam01 - x01);
    return clamp01(1 - age / persistence) ** 0.7;
  };
  const stops: { offset: number; opacity: number }[] = [];
  for (let i = 0; i <= TRACE_STOPS; i++) {
    const x01 = i / TRACE_STOPS;
    stops.push({ offset: x01, opacity: glowAt(x01) });
  }
  stops.push({ offset: beam01, opacity: 1 }, { offset: Math.min(1, beam01 + 1e-4), opacity: glowAt(beam01 + 2e-4) });
  return stops.sort((a, b) => a.offset - b.offset);
};

/** The five basic oscillator shapes drawn large over black, looping seamlessly. */
export const WaveShapesTemplate: React.FC<WaveShapesSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const id = useId().replace(/:/g, "");
  const filterId = `${id}-glow`;
  const traceId = `${id}-trace`;
  const t = frame / durationInFrames;

  const {
    layout,
    cycles,
    amplitude,
    scrollCycles,
    sweepOctaves,
    sweepCycles,
    traceSweeps,
    tracePersistence,
    breath,
    breathCycles,
    lineWidth,
    glow,
    gridOpacity,
    lineColor,
  } = props;
  // Frequency sweep: the wavelength eases between `cycles` and `sweepOctaves` higher, around the center.
  const sweep = 0.5 * (1 - Math.cos(TAU * sweepCycles * t));
  const period = width / (cycles * 2 ** (sweepOctaves * sweep));
  const offset = scrollCycles * t;
  const breathScale = 1 - breath * 0.5 * (1 - Math.cos(TAU * breathCycles * t));
  const tracing = traceSweeps > 0;
  const beam01 = frac(traceSweeps * t);
  const beamX = beam01 * width;

  const rows: { waveform: Waveform; top: number; bottom: number }[] =
    layout === "lineup"
      ? WAVE_SHAPES_WAVEFORMS.map((waveform, r, all) => ({
          waveform,
          top: (r / all.length) * height,
          bottom: ((r + 1) / all.length) * height,
        }))
      : [{ waveform: props.waveform, top: 0, bottom: height }];

  const strokes: Stroke[] = [];
  const beams: { x: number; y: number }[] = [];
  const grid: { d: string; opacity: number; dash?: string }[] = [];
  for (const { waveform, top, bottom } of rows) {
    const rowHeight = bottom - top;
    const cy = layout === "lineup" ? (top + bottom) / 2 : (props.centerY / 100) * height;
    const amp = (amplitude / 100) * rowHeight * breathScale;
    const row = rowStrokes(waveform, props, { width, period, anchorX: width / 2, offset, cy, amp }, t, beamX);
    strokes.push(...row.strokes);
    beams.push(row.beam);
    if (gridOpacity > 0) {
      grid.push(...rowGrid(width, top, bottom, cy, (amplitude / 100) * rowHeight, layout === "lineup" ? 20 : 10));
    }
  }

  const stroke = tracing ? `url(#${traceId})` : lineColor;
  const lines = (widthScale: number) =>
    strokes.map(({ d, opacity, width: w, angular }, i) => (
      <path
        key={i}
        d={d}
        fill="none"
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={w * widthScale}
        strokeLinejoin={angular ? "miter" : "round"}
        strokeMiterlimit={8}
        strokeLinecap="round"
      />
    ));
  const beamDots = (radiusScale: number) =>
    tracing
      ? beams.map(({ x, y }, i) => <circle key={i} cx={x} cy={y} r={lineWidth * radiusScale} fill={lineColor} />)
      : null;

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(props.backgroundColor) }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={filterId} x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation={lineWidth * 1.5 + 6} />
          </filter>
          {tracing ? (
            <linearGradient id={traceId} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={width} y2={0}>
              {traceStops(beam01, tracePersistence).map(({ offset: o, opacity }, i) => (
                <stop key={i} offset={o} stopColor={lineColor} stopOpacity={opacity} />
              ))}
            </linearGradient>
          ) : null}
        </defs>
        {grid.length > 0 ? (
          <g stroke={lineColor} strokeWidth={1.5} fill="none" opacity={gridOpacity}>
            {grid.map(({ d, opacity, dash }, i) => (
              <path key={i} d={d} strokeOpacity={opacity} strokeDasharray={dash} />
            ))}
          </g>
        ) : null}
        {glow > 0 ? (
          <g filter={`url(#${filterId})`} opacity={glow}>
            {lines(3)}
            {beamDots(4)}
          </g>
        ) : null}
        <g>
          {lines(1)}
          {beamDots(1.8)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

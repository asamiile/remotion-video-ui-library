import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import React, { useId, useMemo } from "react";
import { AbsoluteFill, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import { beatAtFrame } from "../../helpers/tempo";
import type { SpectralLinesSchemaType } from "./spectral-lines.schema";

const TAU = Math.PI * 2;
/** visualizeAudio needs a power of two */
const AUDIO_SAMPLES = 64;

/** Band levels synthesized from the beat grid: kick low, hats high, slow pads in between. */
const useTempoBands = (props: SpectralLinesSchemaType): number[] => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const beat = beatAtFrame(frame, durationInFrames, props);
  const phase = frame / durationInFrames;
  const { lineCount, bars, randomSeed } = props;

  const fb = beat % 1;
  const kick = Math.exp(-fb * 6);
  const hat = Math.exp(-((beat + 0.5) % 1) * 14);
  const clap = Math.floor(beat) % 2 === 1 ? Math.exp(-fb * 8) : 0;
  const padCycles = Math.max(1, Math.round(bars / 2));

  return Array.from({ length: lineCount }, (_, i) => {
    const x = lineCount > 1 ? i / (lineCount - 1) : 0;
    const salt = random(`spectral-${randomSeed}-${i}`) * TAU;
    const low = kick * (1 - smoothstep(0, 0.35, x));
    const pad =
      (0.22 + 0.18 * Math.sin(TAU * phase * padCycles + x * 7 + salt)) *
      Math.exp(-(((x - 0.5) / 0.3) ** 2));
    const mid = clap * 0.45 * Math.exp(-(((x - 0.55) / 0.12) ** 2));
    const high =
      hat * 0.75 * smoothstep(0.6, 1, x) +
      0.08 * (1 + Math.sin(TAU * phase * bars + x * 23 + salt));
    return Math.min(1, low + pad + mid + high);
  });
};

/** Band levels from the audio file, low bands spread over more lines. */
const useAudioBands = (props: SpectralLinesSchemaType): number[] | null => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioFrame = frame + Math.round(props.audioOffsetInSeconds * fps);
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile(props.audioFile),
    fps,
    frame: audioFrame,
    windowInSeconds: 10,
  });
  return useMemo(() => {
    if (!audioData) return null;
    const spectrum = visualizeAudio({
      fps,
      frame: audioFrame,
      audioData,
      numberOfSamples: AUDIO_SAMPLES,
      optimizeFor: "speed",
      dataOffsetInSeconds,
    });
    const n = props.lineCount;
    return Array.from({ length: n }, (_, i) => {
      const x = n > 1 ? i / (n - 1) : 0;
      const bin = Math.min(AUDIO_SAMPLES - 1, Math.floor(x * x * (AUDIO_SAMPLES - 1)));
      return Math.min(1, Math.pow(spectrum[bin] * props.sensitivity * 3, 0.7));
    });
  }, [audioData, audioFrame, dataOffsetInSeconds, fps, props.lineCount, props.sensitivity]);
};

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function bandColor(x: number, { colorA, colorB, colorC }: SpectralLinesSchemaType) {
  if (x < 0.2) return colorC;
  if (x > 0.8) return colorB;
  return colorA;
}

function toPath(points: [number, number][]) {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join("");
}

type LinePath = { d: string; x01: number; level: number };

/**
 * Ridge displacement at position u (0-1 along the line) for line i: a bump
 * drifting once per loop, rippling faster on higher bands.
 */
const ridge = (
  u: number,
  i: number,
  x01: number,
  level: number,
  props: SpectralLinesSchemaType,
  phase: number,
) => {
  const salt = random(`spectral-line-${props.randomSeed}-${i}`);
  const center = 0.5 + 0.28 * Math.sin(TAU * (phase + salt));
  const freq = 6 + 18 * x01;
  const drift = Math.max(1, Math.round(props.bars / 4));
  const env = Math.exp(-(((u - center) / 0.16) ** 2));
  const wave =
    0.7 * Math.sin(u * freq + TAU * (phase * drift + salt)) +
    0.3 * Math.sin(u * freq * 2.3 - TAU * phase * drift * 2);
  return props.amplitude * level * env * (0.7 + 0.3 * wave);
};

const SAMPLES = 160;

/** Lines along one axis: `place(u, offset)` maps a position along the line and a displacement to a point. */
const sampledPath = (
  i: number,
  x01: number,
  level: number,
  props: SpectralLinesSchemaType,
  phase: number,
  place: (u: number, offset: number) => [number, number],
): LinePath => {
  const points: [number, number][] = [];
  for (let s = 0; s <= SAMPLES; s++) {
    const u = s / SAMPLES;
    points.push(place(u, ridge(u, i, x01, level, props, phase)));
  }
  return { d: toPath(points), x01, level };
};

const linePaths = (
  bands: number[],
  props: SpectralLinesSchemaType,
  width: number,
  height: number,
  phase: number,
): LinePath[] => {
  const { extent, centerX, centerY } = props;
  const n = bands.length;
  const cx = (centerX / 100) * width;
  const cy = (centerY / 100) * height;
  const x01Of = (i: number) => (n > 1 ? i / (n - 1) : 0);

  if (props.style === "columns") {
    // Low bands on the left; lines run top to bottom and bulge to the right.
    const top = height * 0.06;
    const bottom = height * 0.94;
    return bands.map((level, i) => {
      const x0 = cx - extent / 2 + x01Of(i) * extent;
      return sampledPath(i, x01Of(i), level, props, phase, (u, o) => [x0 + o, top + (bottom - top) * u]);
    });
  }

  const left = width * 0.06;
  const right = width * 0.94;
  const along = (u: number) => left + (right - left) * u;

  if (props.style === "mirror") {
    // Low bands at the center line, high bands outward, each bulging away from the center.
    return bands.flatMap((level, i) => {
      const x01 = x01Of(i);
      const offset = ((i + 0.5) / n) * (extent / 2);
      return [-1, 1].map((sign) =>
        sampledPath(i, x01, level, props, phase, (u, o) => [along(u), cy + sign * (offset + o)]),
      );
    });
  }

  if (props.style === "radial") {
    // Rays around a hairline circle, low bands at the top, mirrored left and right.
    const r0 = extent / 2;
    const rays = bands.flatMap((level, i) => {
      const x01 = x01Of(i);
      const theta = (Math.PI * (i + 0.5)) / n;
      const length = 8 + props.amplitude * level;
      return [-1, 1].map((sign) => {
        const dx = sign * Math.sin(theta);
        const dy = -Math.cos(theta);
        const d = toPath([
          [cx + dx * r0, cy + dy * r0],
          [cx + dx * (r0 + length), cy + dy * (r0 + length)],
        ]);
        return { d, x01, level };
      });
    });
    const circle = Array.from({ length: 97 }, (_, k): [number, number] => {
      const a = (k / 96) * TAU;
      return [cx + Math.cos(a) * (r0 - 6), cy + Math.sin(a) * (r0 - 6)];
    });
    return [...rays, { d: toPath(circle), x01: 0.5, level: 0.4 }];
  }

  // stack: low bands at the bottom, each line rising in its ridge.
  return bands.map((level, i) => {
    const y0 = cy + extent / 2 - x01Of(i) * extent;
    return sampledPath(i, x01Of(i), level, props, phase, (u, o) => [along(u), y0 - o]);
  });
};

const SpectralLinesView: React.FC<{
  bands: number[];
  props: SpectralLinesSchemaType;
}> = ({ bands, props }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const filterId = useId().replace(/:/g, "");
  const phase = frame / durationInFrames;
  const paths = linePaths(bands, props, width, height, phase);

  const lines = (glow: boolean) =>
    paths.map(({ d, x01, level }, i) => (
      <path
        key={i}
        d={d}
        fill="none"
        stroke={bandColor(x01, props)}
        strokeWidth={props.lineWidth * (glow ? 3 : 1)}
        strokeLinejoin="round"
        strokeOpacity={props.opacity * (0.35 + 0.65 * Math.min(1, level * 1.5))}
      />
    ));

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(props.backgroundColor) }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation={6} />
          </filter>
        </defs>
        {props.glow > 0 ? (
          <g filter={`url(#${filterId})`} opacity={props.glow}>
            {lines(true)}
          </g>
        ) : null}
        <g>{lines(false)}</g>
      </svg>
    </AbsoluteFill>
  );
};

const TempoDriven: React.FC<SpectralLinesSchemaType> = (props) => (
  <SpectralLinesView bands={useTempoBands(props)} props={props} />
);

const AudioDriven: React.FC<SpectralLinesSchemaType> = (props) => {
  const bands = useAudioBands(props);
  return bands ? <SpectralLinesView bands={bands} props={props} /> : null;
};

/** Transparent spectrum hairlines, synced to the tempo or to an audio file. */
export const SpectralLinesTemplate: React.FC<SpectralLinesSchemaType> = (props) =>
  props.audioFile ? <AudioDriven {...props} /> : <TempoDriven {...props} />;

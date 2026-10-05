import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/font-jetbrains-mono";
import type { ObjectDetectionOverlaySchemaType } from "./object-detection-overlay.schema";

const TAU = Math.PI * 2;
const APPEAR_FRAMES = 12;
const FADE_FRAMES = 9;
const TAG_FONT = 18;

/** Grid slots (fractions of the frame) so boxes spread out instead of piling up. */
const SLOTS: [number, number][] = [
  [0.22, 0.36],
  [0.42, 0.62],
  [0.62, 0.36],
  [0.8, 0.64],
  [0.24, 0.7],
  [0.5, 0.3],
  [0.78, 0.3],
  [0.6, 0.72],
];

type Track = {
  cx: number;
  cy: number;
  w: number;
  h: number;
  ampX: number;
  ampY: number;
  kx: number;
  ky: number;
  ox: number;
  oy: number;
  start: number;
  life: number;
};

function buildTracks(
  count: number,
  seed: number,
  boxScale: number,
  lockIndex: number,
): Track[] {
  const order = SLOTS.map((_, i) => i).sort(
    (a, b) => random(`slot-${seed}-${a}`) - random(`slot-${seed}-${b}`),
  );
  return Array.from({ length: count }, (_, i) => {
    const r = (salt: string) => random(`track-${seed}-${i}-${salt}`);
    const [sx, sy] = SLOTS[order[i % SLOTS.length]];
    return {
      cx: sx + (r("cx") - 0.5) * 0.06,
      cy: sy + (r("cy") - 0.5) * 0.06,
      w: (170 + r("w") * 170) * boxScale,
      h: (200 + r("h") * 180) * boxScale,
      ampX: 0.02 + r("ax") * 0.05,
      ampY: 0.01 + r("ay") * 0.03,
      kx: 1 + Math.floor(r("kx") * 2),
      ky: 1 + Math.floor(r("ky") * 2),
      ox: r("ox") * TAU,
      oy: r("oy") * TAU,
      start: r("start"),
      life: i === lockIndex ? 1 : 0.6 + r("life") * 0.25,
    };
  });
}

export const ObjectDetectionOverlayTemplate: React.FC<
  ObjectDetectionOverlaySchemaType
> = ({
  primaryColor,
  lockColor,
  tagTextColor,
  title,
  objects,
  lockIndex,
  boxScale,
  showGrid,
  showScanLine,
  showStats,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const phase = frame / durationInFrames;

  const tracks = useMemo(
    () => buildTracks(objects.length, randomSeed, boxScale, lockIndex),
    [objects.length, randomSeed, boxScale, lockIndex],
  );

  const text: React.CSSProperties = {
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    fontWeight: 500,
    letterSpacing: 1,
  };

  let visibleCount = 0;
  const boxes = objects.map((object, i) => {
    const track = tracks[i];
    const isLock = i === lockIndex;
    const color = isLock ? lockColor : primaryColor;

    // Frames since this track appeared; wraps with the loop.
    let age = Infinity;
    let remaining = Infinity;
    if (track.life < 1) {
      const local = (((phase - track.start) % 1) + 1) % 1;
      if (local > track.life) return null;
      age = local * durationInFrames;
      remaining = (track.life - local) * durationInFrames;
    }
    visibleCount++;

    const appear = Math.min(1, age / APPEAR_FRAMES);
    const flicker = age < 8 ? (Math.floor(age / 2) % 2 ? 0.25 : 1) : 1;
    const opacity =
      flicker *
      interpolate(remaining, [0, FADE_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
      });
    const grow = interpolate(appear, [0, 1], [1.45, 1], {
      easing: (x) => 1 - (1 - x) ** 3,
    });

    const cx = (track.cx + track.ampX * Math.sin(TAU * track.kx * phase + track.ox)) * width;
    const cy = (track.cy + track.ampY * Math.sin(TAU * track.ky * phase + track.oy)) * height;
    const breathe = 1 + 0.03 * Math.sin(TAU * 2 * phase + track.oy);
    const w = track.w * breathe * grow;
    const h = track.h * breathe * grow;
    const x = cx - w / 2;
    const y = cy - h / 2;
    const corner = Math.min(w, h) * 0.18;

    const confidence = Math.min(
      0.999,
      Math.max(0, object.confidence + 0.015 * Math.sin(TAU * (3 * phase + i * 0.37))),
    );
    const tagLabel = `${object.label} ${confidence.toFixed(2)}`;
    const tagWidth = tagLabel.length * TAG_FONT * 0.62 + 16;
    const tagHeight = TAG_FONT + 10;

    const cornerPath = [
      `M${x} ${y + corner}V${y}H${x + corner}`,
      `M${x + w - corner} ${y}H${x + w}V${y + corner}`,
      `M${x + w} ${y + h - corner}V${y + h}H${x + w - corner}`,
      `M${x + corner} ${y + h}H${x}V${y + h - corner}`,
    ].join("");

    const reticle = Math.min(w, h) * 0.22;

    return (
      <g key={i} opacity={opacity}>
        {isLock ? (
          <g stroke={lockColor} strokeWidth={1} opacity={0.4} strokeDasharray="6 10">
            <line x1={0} y1={cy} x2={x} y2={cy} />
            <line x1={x + w} y1={cy} x2={width} y2={cy} />
            <line x1={cx} y1={0} x2={cx} y2={y} />
            <line x1={cx} y1={y + h} x2={cx} y2={height} />
          </g>
        ) : null}
        <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={0.04} stroke={color} strokeOpacity={0.45} strokeWidth={1.5} />
        <path d={cornerPath} fill="none" stroke={color} strokeWidth={4} strokeLinecap="square" />
        {isLock ? (
          <g transform={`translate(${cx} ${cy}) rotate(${45 + phase * 360})`} fill="none" stroke={lockColor}>
            <rect x={-reticle / 2} y={-reticle / 2} width={reticle} height={reticle} strokeWidth={2} />
            <circle r={reticle * 0.18} strokeWidth={2} />
          </g>
        ) : (
          <path d={`M${cx - 10} ${cy}H${cx + 10}M${cx} ${cy - 10}V${cy + 10}`} stroke={color} strokeWidth={1.5} opacity={0.7} />
        )}
        <rect x={x - 2} y={y - tagHeight} width={tagWidth} height={tagHeight} fill={color} />
        <text x={x + 6} y={y - 8} fill={tagTextColor} fontSize={TAG_FONT} style={{ ...text, fontWeight: 700 }}>
          {tagLabel}
        </text>
        <text x={x + w} y={y + h + 22} fill={color} fontSize={14} textAnchor="end" style={text}>
          {`ID ${String(i + 1).padStart(2, "0")}  ${Math.round(w)}x${Math.round(h)}`}
        </text>
        {isLock ? (
          <text x={x} y={y + h + 22} fill={lockColor} fontSize={14} style={{ ...text, fontWeight: 700 }} opacity={Math.floor(frame / 8) % 2 ? 1 : 0.35}>
            TARGET LOCK
          </text>
        ) : null}
      </g>
    );
  });

  const scanY = ((phase * 2) % 1) * height;
  const inferMs = 11 + random(`infer-${randomSeed}-${Math.floor(frame / 6)}`) * 6;
  const seconds = frame / fps;
  const timecode = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}:${String(frame % fps).padStart(2, "0")}`;
  const margin = 48;
  const screenCorner = 56;

  return (
    <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="odo-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={primaryColor} stopOpacity={0} />
            <stop offset="1" stopColor={primaryColor} stopOpacity={0.18} />
          </linearGradient>
        </defs>

        {showGrid ? (
          <g stroke={primaryColor} strokeOpacity={0.07} strokeWidth={1}>
            {Array.from({ length: 15 }, (_, i) => (
              <line key={`v${i}`} x1={(width / 16) * (i + 1)} y1={0} x2={(width / 16) * (i + 1)} y2={height} />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={(height / 9) * (i + 1)} x2={width} y2={(height / 9) * (i + 1)} />
            ))}
          </g>
        ) : null}

        {showScanLine ? (
          <g>
            <rect x={0} y={scanY - 140} width={width} height={140} fill="url(#odo-scan)" />
            <line x1={0} y1={scanY} x2={width} y2={scanY} stroke={primaryColor} strokeOpacity={0.6} strokeWidth={1.5} />
          </g>
        ) : null}

        {boxes}

        <path
          d={[
            `M${margin} ${margin + screenCorner}V${margin}H${margin + screenCorner}`,
            `M${width - margin - screenCorner} ${margin}H${width - margin}V${margin + screenCorner}`,
            `M${width - margin} ${height - margin - screenCorner}V${height - margin}H${width - margin - screenCorner}`,
            `M${margin + screenCorner} ${height - margin}H${margin}V${height - margin - screenCorner}`,
          ].join("")}
          fill="none"
          stroke={primaryColor}
          strokeWidth={2}
          opacity={0.8}
        />

        {showStats ? (
          <g fill={primaryColor} style={text}>
            <text x={margin + 24} y={margin + 34} fontSize={20} style={{ ...text, fontWeight: 700 }}>
              {title}
            </text>
            <text x={margin + 24} y={margin + 64} fontSize={15} opacity={0.85}>
              {`OBJECTS ${String(visibleCount).padStart(2, "0")}   INFER ${inferMs.toFixed(1)}ms   CONF>=0.70`}
            </text>
            <text x={width - margin - 24} y={margin + 34} fontSize={18} textAnchor="end">
              {`REC ${timecode}`}
            </text>
            <circle cx={width - margin - 24 - 168} cy={margin + 28} r={6} fill={lockColor} opacity={Math.floor(frame / 15) % 2 ? 1 : 0.2} />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

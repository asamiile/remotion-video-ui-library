import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BurstSchemaV1Type } from "./burst.schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

function jaggedBlobPoints(
  cx: number,
  cy: number,
  radius: number,
  seed: string,
  vertexCount = 9,
) {
  return Array.from({ length: vertexCount })
    .map((_, i) => {
      const angle = (i / vertexCount) * Math.PI * 2;
      const r = radius * (0.5 + random(`${seed}-r-${i}`) * 0.6);
      return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
    })
    .join(" ");
}

export const BurstTemplateV1: React.FC<
  BurstSchemaV1Type
> = ({
  backgroundColor,
  inkColor,
  flashColor,
  lightningColor,
  inkShapeCount,
  lightningCount,
  popInFrames,
  flashDecayFrames,
  lightningDecayFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glowFilterId = useId().replace(/:/g, "");
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) * 0.42;

  const flashOpacity = interpolate(frame, [0, flashDecayFrames], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const lightningOpacity = interpolate(
    frame,
    [0, 2, lightningDecayFrames],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const inkShapes = useMemo(
    () =>
      Array.from({ length: inkShapeCount }).map((_, i) => {
        const angle = (i / inkShapeCount) * Math.PI * 2;
        const dist = maxRadius * (0.25 + random(`${randomSeed}-d-${i}`) * 0.5);
        const shapeCx = cx + Math.cos(angle) * dist;
        const shapeCy = cy + Math.sin(angle) * dist;
        const radius = maxRadius * (0.18 + random(`${randomSeed}-sz-${i}`) * 0.22);
        const points = jaggedBlobPoints(
          shapeCx,
          shapeCy,
          radius,
          `${randomSeed}-blob-${i}`,
        );
        const startFrame = random(`${randomSeed}-st-${i}`) * popInFrames * 0.5;
        return { points, shapeCx, shapeCy, startFrame };
      }),
    [inkShapeCount, maxRadius, cx, cy, popInFrames, randomSeed],
  );

  const lightningBolts = useMemo(
    () =>
      Array.from({ length: lightningCount }).map((_, i) => {
        const angle = (i / lightningCount) * Math.PI * 2 + 0.3;
        const segments = 4;
        const points = Array.from({ length: segments + 1 })
          .map((_, s) => {
            const t = s / segments;
            const r = maxRadius * 1.3 * t;
            const jitter =
              (random(`${randomSeed}-lj-${i}-${s}`) - 0.5) * maxRadius * 0.25;
            const x = cx + Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * jitter;
            const y = cy + Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * jitter;
            return `${x},${y}`;
          })
          .join(" ");
        return points;
      }),
    [lightningCount, maxRadius, cx, cy, randomSeed],
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={4} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {inkShapes.map((shape, i) => {
          const localFrame = frame - shape.startFrame;
          const scale = interpolate(localFrame, [0, popInFrames], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.4)),
          });
          return (
            <polygon
              key={i}
              points={shape.points}
              fill={inkColor}
              opacity={scale > 0 ? 1 : 0}
              style={{
                transformOrigin: `${shape.shapeCx}px ${shape.shapeCy}px`,
                transform: `scale(${scale})`,
              }}
            />
          );
        })}

        {lightningBolts.map((points, i) => (
          <polyline
            key={i}
            points={points}
            fill="none"
            stroke={lightningColor}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={lightningOpacity}
            filter={`url(#${glowFilterId})`}
          />
        ))}
      </svg>

      <AbsoluteFill
        style={{
          backgroundColor: flashColor,
          opacity: flashOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

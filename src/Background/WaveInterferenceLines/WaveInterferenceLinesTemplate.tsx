import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WaveInterferenceLinesSchemaType } from "./wave-interference-lines.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const SAMPLE_POINTS = 60;

/**
 * Multicolor thin line traces overlapping into a sine-wave interference
 * pattern, centered on a horizontal glow band. Each line has its own
 * randomized amplitude/frequency/phase so the overlap reads as organic
 * rather than perfectly repeating.
 */
export const WaveInterferenceLinesTemplate: React.FC<
  WaveInterferenceLinesSchemaType
> = ({
  backgroundColor,
  bandColor,
  bandHeightPercent,
  bandOpacity,
  lineCount,
  lineColors,
  lineWidthPx,
  waveAmplitudePx,
  waveFrequency,
  phaseSpeed,
  flashCount,
  flashHoldFrames,
  flashColor,
  gridOpacity,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const centerY = height / 2;
  const bandHeight = (bandHeightPercent / 100) * height;

  const lines = useMemo(() => {
    return new Array(lineCount).fill(0).map((_, i) => ({
      color: lineColors[i % lineColors.length],
      ampScale: 0.6 + random(`${randomSeed}-amp-${i}`) * 0.8,
      freqScale: 0.7 + random(`${randomSeed}-freq-${i}`) * 0.6,
      phase: random(`${randomSeed}-phase-${i}`) * Math.PI * 2,
      speedScale: 0.7 + random(`${randomSeed}-speed-${i}`) * 0.6,
    }));
  }, [lineCount, lineColors, randomSeed]);

  const flashes = useMemo(() => {
    return new Array(flashCount).fill(0).map((_, i) => ({
      startFrame: Math.floor(
        random(`${randomSeed}-flash-${i}`) *
          Math.max(durationInFrames - flashHoldFrames, 1),
      ),
    }));
  }, [flashCount, randomSeed, durationInFrames, flashHoldFrames]);

  const flashOpacity = flashes.reduce((maxOpacity, f) => {
    const local = frame - f.startFrame;
    if (local < 0 || local > flashHoldFrames) return maxOpacity;
    const opacity = interpolate(
      local,
      [0, flashHoldFrames * 0.4, flashHoldFrames],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return Math.max(maxOpacity, opacity);
  }, 0);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: centerY - bandHeight / 2,
          height: bandHeight,
          background: `linear-gradient(to bottom, transparent 0%, ${bandColor}66 30%, ${bandColor} 50%, ${bandColor}66 70%, transparent 100%)`,
          opacity: bandOpacity,
        }}
      />

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        {lines.map((line, i) => {
          const points = new Array(SAMPLE_POINTS + 1).fill(0).map((_, p) => {
            const t = p / SAMPLE_POINTS;
            const x = t * width;
            const angle =
              t * waveFrequency * line.freqScale * Math.PI * 2 +
              line.phase +
              frame * phaseSpeed * line.speedScale;
            const y = centerY + Math.sin(angle) * waveAmplitudePx * line.ampScale;
            return `${x},${y}`;
          });
          return (
            <polyline
              key={i}
              points={points.join(" ")}
              fill="none"
              stroke={line.color as string}
              strokeWidth={lineWidthPx}
              opacity={0.85}
            />
          );
        })}
      </svg>

      {flashOpacity > 0 && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 24px)",
              opacity: gridOpacity * flashOpacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: flashColor as string,
              opacity: flashOpacity,
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StripeWaveFieldSchemaType } from "./stripe-wave-field.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const SAMPLE_POINTS = 60;

/** Triangle wave in [-1, 1], same period/phase as Math.sin */
function triangleWave(angle: number): number {
  return (Math.asin(Math.sin(angle)) * 2) / Math.PI;
}

/**
 * A multicolor vertical-stripe (barcode-like) gradient background whose hues
 * continuously cycle, overlaid with a multi-line wave-interference pattern
 * that builds up from a near-flat quiet state and winds back down at the end.
 */
export const StripeWaveFieldTemplate: React.FC<StripeWaveFieldSchemaType> = ({
  backgroundColor,
  stripeColors,
  stripeCount,
  hueRotateSpeed,
  gridOverlayOpacity,
  lineCount,
  lineColor,
  lineWidthPx,
  waveAmplitudePx,
  waveFrequency,
  jaggedness,
  phaseSpeed,
  buildUpFrames,
  windDownFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const centerY = height / 2;

  const envelope = Math.min(
    interpolate(frame, [0, buildUpFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(
      frame,
      [durationInFrames - windDownFrames, durationInFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  );

  const stripeGradient = useMemo(() => {
    const widths = new Array(stripeCount)
      .fill(0)
      .map((_, i) => 0.4 + random(`${randomSeed}-stripe-w-${i}`) * 1.2);
    const total = widths.reduce((sum, w) => sum + w, 0);
    let acc = 0;
    const stops: string[] = [];
    widths.forEach((w, i) => {
      const color = stripeColors[i % stripeColors.length];
      const start = (acc / total) * 100;
      acc += w;
      const end = (acc / total) * 100;
      stops.push(`${color} ${start}% ${end}%`);
    });
    return `linear-gradient(to right, ${stops.join(", ")})`;
  }, [stripeCount, stripeColors, randomSeed]);

  const lines = useMemo(() => {
    return new Array(lineCount).fill(0).map((_, i) => ({
      ampScale: 0.6 + random(`${randomSeed}-amp-${i}`) * 0.8,
      freqScale: 0.7 + random(`${randomSeed}-freq-${i}`) * 0.6,
      phase: random(`${randomSeed}-phase-${i}`) * Math.PI * 2,
      speedScale: 0.7 + random(`${randomSeed}-speed-${i}`) * 0.6,
    }));
  }, [lineCount, randomSeed]);

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
          inset: 0,
          backgroundImage: stripeGradient,
          // Oscillates within a bounded range (rather than a full 360deg sweep) so the
          // palette stays within the same cool hue family instead of drifting warm.
          filter: `hue-rotate(${Math.sin(frame * hueRotateSpeed * 0.02) * 35}deg)`,
          opacity: envelope,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 28px)",
          opacity: gridOverlayOpacity * envelope,
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
            const shape =
              (1 - jaggedness) * Math.sin(angle) + jaggedness * triangleWave(angle);
            const y = centerY + shape * waveAmplitudePx * line.ampScale * envelope;
            return `${x},${y}`;
          });
          return (
            <polyline
              key={i}
              points={points.join(" ")}
              fill="none"
              stroke={lineColor as string}
              strokeWidth={lineWidthPx}
              opacity={0.4 + envelope * 0.5}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

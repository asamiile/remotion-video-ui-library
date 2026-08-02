import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HalftoneWaveformSchemaType } from "./halftone-waveform.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

/**
 * A dot-matrix (halftone) audio-waveform-style graphic, symmetric around the
 * horizontal center axis, drawn over a hue-cycling multicolor horizontal
 * gradient. Two waveform shapes are supported: a smoothly pulsing sine
 * envelope, or a per-column noise envelope that re-rolls periodically for a
 * sharp, spiky look. A handful of brief white-flash accents are scattered
 * across the duration.
 */
export const HalftoneWaveformTemplate: React.FC<HalftoneWaveformSchemaType> = ({
  backgroundColor,
  bandColors,
  hueRotateSpeed,
  waveShapeType,
  waveColor,
  gridColumns,
  maxRows,
  dotSizePx,
  amplitudePercent,
  frequency,
  phaseSpeed,
  noiseUpdateEveryFrames,
  flashCount,
  flashHoldFrames,
  flashColor,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const centerY = height / 2;
  const maxAmpPx = (amplitudePercent / 100) * (height / 2);
  const rowSpacingPx = maxAmpPx / maxRows;

  const bandGradient = useMemo(
    () => `linear-gradient(to bottom, ${bandColors.join(", ")})`,
    [bandColors],
  );

  const dots = useMemo(() => {
    const result: { x: number; y: number; r: number }[] = [];
    for (let c = 0; c < gridColumns; c++) {
      const t = c / Math.max(gridColumns - 1, 1);
      const x = t * width;

      let shapeValue: number;
      if (waveShapeType === "spikyNoise") {
        const bucketFrame = frame / noiseUpdateEveryFrames;
        const bucket0 = Math.floor(bucketFrame);
        const frac = bucketFrame - bucket0;
        const v0 = random(`${randomSeed}-noise-${c}-${bucket0}`);
        const v1 = random(`${randomSeed}-noise-${c}-${bucket0 + 1}`);
        shapeValue = v0 * (1 - frac) + v1 * frac;
      } else {
        const angle = t * frequency * Math.PI * 2 + frame * phaseSpeed;
        shapeValue = 0.15 + 0.85 * Math.abs(Math.sin(angle));
      }

      const activeRows = Math.round(shapeValue * maxRows);
      for (let r = 0; r <= activeRows; r++) {
        const dy = r * rowSpacingPx;
        const dotR = dotSizePx * (1 - (r / Math.max(maxRows, 1)) * 0.3);
        result.push({ x, y: centerY - dy, r: dotR });
        if (r > 0) {
          result.push({ x, y: centerY + dy, r: dotR });
        }
      }
    }
    return result;
  }, [
    gridColumns,
    width,
    waveShapeType,
    frame,
    noiseUpdateEveryFrames,
    randomSeed,
    frequency,
    phaseSpeed,
    maxRows,
    rowSpacingPx,
    dotSizePx,
    centerY,
  ]);

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
          inset: 0,
          backgroundImage: bandGradient,
          // Oscillates within a bounded range (rather than a full 360deg sweep) so the
          // palette stays within the same cool hue family instead of drifting warm.
          filter: `hue-rotate(${Math.sin(frame * hueRotateSpeed * 0.02) * 35}deg)`,
          opacity: 0.55,
        }}
      />

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill={waveColor as string}
          />
        ))}
      </svg>

      {flashOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: flashColor as string,
            opacity: flashOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

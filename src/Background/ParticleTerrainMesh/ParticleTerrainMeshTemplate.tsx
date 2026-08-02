import React, { useMemo } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ParticleTerrainMeshSchemaType } from "./particle-terrain-mesh.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const ParticleTerrainMeshTemplate: React.FC<
  ParticleTerrainMeshSchemaType
> = ({
  backgroundColor,
  particleColor,
  gridColumns,
  gridRows,
  amplitudePx,
  waveFrequency,
  animationSpeed,
  particleSizePx,
  perspectiveStrength,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const centerX = width / 2;
  const baseY = height * 0.62;
  const spanY = height * 0.5;

  const points = useMemo(() => {
    const result: { x: number; y: number; size: number; opacity: number }[] = [];
    for (let r = 0; r < gridRows; r++) {
      const depth = r / Math.max(gridRows - 1, 1);
      const spreadFactor = 1 - depth * perspectiveStrength;
      const rowY = baseY - depth * spanY;

      for (let c = 0; c < gridColumns; c++) {
        const t = c / Math.max(gridColumns - 1, 1);
        const jitter = (random(`${randomSeed}-j-${r}-${c}`) - 0.5) * 4;
        const x = centerX + (t - 0.5) * width * spreadFactor + jitter;

        const phase =
          t * Math.PI * 2 * waveFrequency +
          frame * animationSpeed * 0.1 +
          depth * 2.4;
        const waveY = Math.sin(phase) * amplitudePx * spreadFactor;

        result.push({
          x,
          y: rowY + waveY,
          size: particleSizePx * (1 - depth * 0.6),
          opacity: 1 - depth * 0.7,
        });
      }
    }
    return result;
  }, [
    gridRows,
    gridColumns,
    perspectiveStrength,
    baseY,
    spanY,
    centerX,
    width,
    waveFrequency,
    frame,
    animationSpeed,
    amplitudePx,
    particleSizePx,
    randomSeed,
  ]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={particleColor as string}
            opacity={p.opacity}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

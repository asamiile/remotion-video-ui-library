import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SilhouetteDreamBackdropSchemaType } from "./silhouette-dream-backdrop.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const SilhouetteDreamBackdropTemplate: React.FC<
  SilhouetteDreamBackdropSchemaType
> = ({
  backgroundColor,
  silhouetteEnabled,
  silhouetteColor,
  silhouetteXPercent,
  silhouetteScale,
  orbColor,
  orbGlowColor,
  orbSizePx,
  orbXPercent,
  orbYPercent,
  particleCount,
  particleColor,
  particleSizePx,
  particleDriftPxPerFrame,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const orbGlowId = useId().replace(/:/g, "");

  const silhouetteX = (silhouetteXPercent / 100) * width;
  const orbX = (orbXPercent / 100) * width;
  const orbY = (orbYPercent / 100) * height;

  const particles = useMemo(() => {
    return new Array(particleCount).fill(0).map((_, i) => ({
      x: random(`${randomSeed}-px-${i}`) * width,
      startY: random(`${randomSeed}-py-${i}`) * height,
      swaySpeed: 0.02 + random(`${randomSeed}-pspeed-${i}`) * 0.03,
      swayAmp: 6 + random(`${randomSeed}-psway-${i}`) * 14,
      phase: random(`${randomSeed}-pphase-${i}`) * Math.PI * 2,
    }));
  }, [particleCount, width, height, randomSeed]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={orbGlowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={orbColor as string} stopOpacity={1} />
            <stop offset="40%" stopColor={orbGlowColor as string} stopOpacity={0.6} />
            <stop offset="100%" stopColor={orbGlowColor as string} stopOpacity={0} />
          </radialGradient>
        </defs>

        {silhouetteEnabled && (
          <g transform={`translate(${silhouetteX}, ${height}) scale(${silhouetteScale})`}>
            <ellipse cx={0} cy={-420} rx={44} ry={54} fill={silhouetteColor as string} />
            <path
              d="M -90 -370 C -90 -260 -70 -120 -60 0 L 60 0 C 70 -120 90 -260 90 -370 C 60 -400 -60 -400 -90 -370 Z"
              fill={silhouetteColor as string}
            />
          </g>
        )}

        <circle cx={orbX} cy={orbY} r={orbSizePx * 2.2} fill={`url(#${orbGlowId})`} />
        <circle cx={orbX} cy={orbY} r={orbSizePx * 0.4} fill={orbColor as string} />

        {particles.map((p, i) => {
          const y = ((p.startY - frame * particleDriftPxPerFrame) % height + height) % height;
          const x = p.x + Math.sin(frame * p.swaySpeed + p.phase) * p.swayAmp;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={particleSizePx}
              fill={particleColor as string}
              opacity={0.7}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

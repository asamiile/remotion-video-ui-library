import React, { useId, useMemo } from "react";
import { AbsoluteFill, random, useVideoConfig } from "remotion";
import { AgedParchmentOverlaySchemaType } from "./aged-parchment-overlay.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const AgedParchmentOverlayTemplate: React.FC<
  AgedParchmentOverlaySchemaType
> = ({
  baseColor,
  edgeVignetteColor,
  edgeVignetteOpacity,
  mottleColor,
  mottleOpacity,
  mottleCount,
  grainOpacity,
  grainScale,
  randomSeed,
}) => {
  const { width, height } = useVideoConfig();
  const filterId = useId().replace(/:/g, "");
  const vignetteId = useId().replace(/:/g, "");

  const mottles = useMemo(() => {
    return new Array(mottleCount).fill(0).map((_, i) => ({
      x: random(`${randomSeed}-mx-${i}`) * width,
      y: random(`${randomSeed}-my-${i}`) * height,
      r: 40 + random(`${randomSeed}-mr-${i}`) * 120,
    }));
  }, [mottleCount, width, height, randomSeed]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(baseColor),
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.01 * grainScale}
              numOctaves={3}
              seed={4}
              result="noise"
            />
            <feColorMatrix in="noise" type="saturate" values="0" />
          </filter>
          <radialGradient id={vignetteId} cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor={edgeVignetteColor as string} stopOpacity={0} />
            <stop offset="100%" stopColor={edgeVignetteColor as string} stopOpacity={edgeVignetteOpacity} />
          </radialGradient>
        </defs>

        {mottles.map((m, i) => (
          <circle
            key={i}
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill={mottleColor as string}
            opacity={mottleOpacity}
          />
        ))}

        <rect width={width} height={height} filter={`url(#${filterId})`} opacity={grainOpacity} />
        <rect width={width} height={height} fill={`url(#${vignetteId})`} />
      </svg>
    </AbsoluteFill>
  );
};

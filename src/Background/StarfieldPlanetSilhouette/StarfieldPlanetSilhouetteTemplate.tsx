import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StarfieldPlanetSilhouetteSchemaType } from "./starfield-planet-silhouette.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const StarfieldPlanetSilhouetteTemplate: React.FC<
  StarfieldPlanetSilhouetteSchemaType
> = ({
  backgroundColor,
  starCount,
  starColor,
  starTwinkle,
  planetColor,
  planetRadiusPx,
  planetXPercent,
  planetYPercent,
  crescentEnabled,
  crescentOffsetPercent,
  glowColor,
  glowOpacity,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glowId = useId().replace(/:/g, "");

  const stars = useMemo(() => {
    return new Array(starCount).fill(0).map((_, i) => ({
      x: random(`${randomSeed}-sx-${i}`) * width,
      y: random(`${randomSeed}-sy-${i}`) * height,
      r: 0.6 + random(`${randomSeed}-sr-${i}`) * 1.6,
      phase: random(`${randomSeed}-sp-${i}`) * Math.PI * 2,
      speed: 0.03 + random(`${randomSeed}-ss-${i}`) * 0.05,
    }));
  }, [starCount, width, height, randomSeed]);

  const planetX = (planetXPercent / 100) * width;
  const planetY = (planetYPercent / 100) * height;
  const crescentDx = planetRadiusPx * (crescentOffsetPercent / 100) * 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id={glowId}>
            <rect width={width} height={height} />
          </clipPath>
        </defs>

        {stars.map((star, i) => {
          const opacity = starTwinkle
            ? 0.4 + Math.abs(Math.sin(frame * star.speed + star.phase)) * 0.6
            : 0.85;
          return (
            <circle
              key={i}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill={starColor as string}
              opacity={opacity}
            />
          );
        })}

        <circle
          cx={planetX}
          cy={planetY}
          r={planetRadiusPx * 1.25}
          fill={glowColor as string}
          opacity={glowOpacity}
        />

        <g clipPath={`url(#${glowId})`}>
          <circle cx={planetX} cy={planetY} r={planetRadiusPx} fill={planetColor as string} />
          {crescentEnabled && (
            <circle
              cx={planetX + crescentDx}
              cy={planetY}
              r={planetRadiusPx}
              fill={backgroundColor as string}
            />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { InterlaceGlowBandSchemaType } from "./interlace-glow-band.schema";

export const InterlaceGlowBandTemplate: React.FC<
  InterlaceGlowBandSchemaType
> = ({
  glowColor,
  bandHeightPercent,
  glowIntensity,
  interlaceLineSpacingPx,
  interlaceOpacity,
  glitchJitterPx,
  glitchEveryFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const generation = Math.floor(frame / glitchEveryFrames);
  const jitterX =
    (random(`${randomSeed}-${generation}`) - 0.5) * 2 * glitchJitterPx;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: `${bandHeightPercent}%`,
          background: `linear-gradient(to bottom, transparent, ${glowColor})`,
          opacity: glowIntensity,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: -glitchJitterPx * 2,
          right: -glitchJitterPx * 2,
          bottom: 0,
          height: `${bandHeightPercent}%`,
          transform: `translateX(${jitterX}px)`,
          opacity: interlaceOpacity,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent ${interlaceLineSpacingPx}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

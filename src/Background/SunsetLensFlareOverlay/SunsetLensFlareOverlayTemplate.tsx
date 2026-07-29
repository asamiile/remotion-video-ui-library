import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { SunsetLensFlareOverlaySchemaType } from "./sunset-lens-flare-overlay.schema";

export const SunsetLensFlareOverlayTemplate: React.FC<
  SunsetLensFlareOverlaySchemaType
> = ({
  flareColor,
  flareXPercent,
  flareYPercent,
  flareRadiusPx,
  streakColor,
  streakCount,
  streakLengthPx,
  streakThicknessPx,
  warmWashColor,
  warmWashOpacity,
}) => {
  const streaks = useMemo(
    () =>
      Array.from({ length: streakCount }).map((_, i) => {
        const angleDeg = (360 / Math.max(1, streakCount)) * i;
        return { angleDeg };
      }),
    [streakCount],
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {streaks.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${flareXPercent}%`,
            top: `${flareYPercent}%`,
            width: streakLengthPx,
            height: streakThicknessPx,
            background: `linear-gradient(to right, transparent, ${streakColor}, transparent)`,
            opacity: 0.35,
            transform: `translate(-50%, -50%) rotate(${s.angleDeg}deg)`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: `${flareXPercent}%`,
          top: `${flareYPercent}%`,
          width: flareRadiusPx * 2,
          height: flareRadiusPx * 2,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${flareColor} 0%, ${flareColor}88 25%, transparent 70%)`,
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor: warmWashColor,
          opacity: warmWashOpacity,
          mixBlendMode: "color",
        }}
      />
    </AbsoluteFill>
  );
};

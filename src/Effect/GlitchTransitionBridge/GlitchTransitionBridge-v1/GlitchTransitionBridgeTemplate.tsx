import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { GlitchTransitionBridgeSchemaV1Type } from "./glitch-transition-bridge-schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

export const GlitchTransitionBridgeTemplateV1: React.FC<
  GlitchTransitionBridgeSchemaV1Type
> = ({
  backgroundColor,
  streakCount,
  streakBaseColor,
  channelAColor,
  channelBColor,
  streakChannelShiftPx,
  lineArtEnabled,
  lineArtColor,
  randomSeed,
}) => {
  const frame = useCurrentFrame();

  const streaks = useMemo(
    () =>
      Array.from({ length: streakCount }).map((_, i) => {
        const leftPercent = random(`${randomSeed}-x-${i}`) * 100;
        const widthPx = 2 + random(`${randomSeed}-w-${i}`) * 5;
        const heightPercent = 55 + random(`${randomSeed}-h-${i}`) * 45;
        const topPercent = random(`${randomSeed}-y-${i}`) * (100 - heightPercent);
        return { leftPercent, widthPx, heightPercent, topPercent };
      }),
    [streakCount, randomSeed],
  );

  const flicker = 0.75 + 0.25 * random(`${randomSeed}-flicker-${frame}`);

  return (
    <AbsoluteFill
      style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}
    >
      {streaks.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.leftPercent}%`,
            top: `${s.topPercent}%`,
            height: `${s.heightPercent}%`,
            width: s.widthPx,
            opacity: flicker,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: streakBaseColor,
              transform: `translateX(-${streakChannelShiftPx}px)`,
              mixBlendMode: "screen",
              background: `linear-gradient(to bottom, transparent 0%, ${channelAColor} 12%, ${channelAColor} 88%, transparent 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${streakChannelShiftPx}px)`,
              mixBlendMode: "screen",
              background: `linear-gradient(to bottom, transparent 0%, ${channelBColor} 12%, ${channelBColor} 88%, transparent 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: streakBaseColor,
            }}
          />
        </div>
      ))}

      {lineArtEnabled ? (
        <svg
          width="18%"
          height="18%"
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            right: "12%",
            top: "38%",
            opacity: 0.6,
          }}
        >
          <polyline
            points="8,8 92,50 8,92 30,50 8,8"
            fill="none"
            stroke={lineArtColor}
            strokeWidth={2}
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

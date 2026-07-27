import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LetterboxOverlaySchemaV1Type } from "./letterbox-overlay-schema";

export const LetterboxOverlayTemplateV1: React.FC<
  LetterboxOverlaySchemaV1Type
> = ({ barColor, barHeightPercent, revealFrames, delayFrames }) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const heightPercent =
    revealFrames <= 0
      ? activeFrame >= 0
        ? barHeightPercent
        : 0
      : interpolate(activeFrame, [0, revealFrames], [0, barHeightPercent], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${heightPercent}%`,
          backgroundColor: barColor,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${heightPercent}%`,
          backgroundColor: barColor,
        }}
      />
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CinematicPresentsCreditSchemaType } from "./cinematic-presents-credit.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const CinematicPresentsCreditTemplate: React.FC<
  CinematicPresentsCreditSchemaType
> = ({
  lines,
  fontFamily,
  letterSpacing,
  textColor,
  backgroundColor,
  perLineHoldFrames,
  fadeFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const lineIndex = Math.min(
    Math.max(Math.floor(activeFrame / perLineHoldFrames), 0),
    lines.length - 1,
  );
  const line = lines[lineIndex];
  const frameWithinLine = activeFrame - lineIndex * perLineHoldFrames;

  const opacity =
    activeFrame < 0
      ? 0
      : interpolate(
          frameWithinLine,
          [
            0,
            fadeFrames,
            Math.max(perLineHoldFrames - fadeFrames, fadeFrames),
            perLineHoldFrames,
          ],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.quad),
          },
        );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: line.fontSize,
          letterSpacing,
          color: textColor,
          opacity,
          textAlign: "center",
        }}
      >
        {line.text}
      </div>
    </AbsoluteFill>
  );
};

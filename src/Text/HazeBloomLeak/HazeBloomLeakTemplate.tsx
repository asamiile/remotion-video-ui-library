import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HazeBloomLeakTemplate } from "../../Background/HazeBloomLeak/HazeBloomLeakTemplate";
import { hazeBloomLeakPatterns } from "../../Background/HazeBloomLeak/haze-bloom-leak.schema";
import "../../helpers/font-line-seed-jp";
import "../../helpers/font-space-grotesk";
import type { HazeBloomLeakTextSchemaType } from "./haze-bloom-leak.schema";

/** Blend between linear and smoothstep progress. */
const easeTravel = (t: number, amount: number) => {
  const smooth = t * t * (3 - 2 * t);
  return t + (smooth - t) * amount;
};

export const HazeBloomLeakTextTemplate: React.FC<HazeBloomLeakTextSchemaType> = ({
  text,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  textColor,
  textOpacity,
  textOffsetX,
  textOffsetY,
  backgroundPattern,
  backgroundTravel,
  easing,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const linear = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = easeTravel(linear, easing);

  // The background moves down, centered on the midpoint, while the text stays
  // put. It is oversized so its edges never show.
  const travelPx = backgroundTravel * height;
  const backgroundY = interpolate(progress, [0, 1], [-travelPx / 2, travelPx / 2]);
  const backgroundScale = 1 + backgroundTravel + 0.02;

  const background = hazeBloomLeakPatterns[backgroundPattern] ?? hazeBloomLeakPatterns.edgeWarm;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${backgroundY}px) scale(${backgroundScale})`,
        }}
      >
        <HazeBloomLeakTemplate {...background} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${textOffsetX * width}px, ${textOffsetY * height}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize,
            fontWeight,
            letterSpacing,
            lineHeight: 1,
            color: textColor,
            opacity: textOpacity,
            // Break only at "\n" in the text, never automatically
            whiteSpace: "pre",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DepthDollyCreditSchemaType } from "./depth-dolly-credit.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const DepthDollyCreditTemplate: React.FC<DepthDollyCreditSchemaType> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  startScale,
  overshootScale,
  startBlurPx,
  startOpacity,
  bandWidth,
  sweepDurationFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;

  /** Dolly band travels from just before the text to just past it, so every
   * character both starts distant and ends settled at full size. */
  const bandPosition = interpolate(
    activeFrame,
    [0, sweepDurationFrames],
    [-bandWidth, 1 + bandWidth],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
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
          fontSize,
          letterSpacing,
          color: textColor,
          whiteSpace: "pre",
        }}
      >
        {chars.map((ch, i) => {
          const charPos = n <= 1 ? 0 : i / (n - 1);
          const dist = bandPosition - charPos;

          const pushAmount = interpolate(dist, [-bandWidth, bandWidth], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(
            pushAmount,
            [0, 0.7, 1],
            [startScale, overshootScale, 1],
          );
          const blurPx = interpolate(pushAmount, [0, 1], [startBlurPx, 0]);
          const opacity = interpolate(pushAmount, [0, 1], [startOpacity, 1]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                filter: `blur(${blurPx}px)`,
                transform: `scale(${scale})`,
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

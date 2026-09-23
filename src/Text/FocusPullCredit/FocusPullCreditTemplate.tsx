import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FocusPullCreditSchemaType } from "./focus-pull-credit.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const FocusPullCreditTemplate: React.FC<FocusPullCreditSchemaType> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  dimOpacity,
  maxBlurPx,
  bandWidth,
  pulseScale,
  sweepDurationFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;

  /** Focus band position travels from just before the text to just past it, so every
   * character both starts blurred and ends fully resolved. */
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

          const focusAmount = interpolate(dist, [-bandWidth, bandWidth], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const blurPx = interpolate(focusAmount, [0, 1], [maxBlurPx, 0]);
          const opacity = interpolate(focusAmount, [0, 1], [dimOpacity, 1]);

          const bump = Math.max(0, 1 - Math.abs(dist) / bandWidth);
          const scale = 1 + pulseScale * bump;

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

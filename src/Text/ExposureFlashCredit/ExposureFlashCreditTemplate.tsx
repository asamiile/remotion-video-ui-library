import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ExposureFlashCreditSchemaType } from "./exposure-flash-credit.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const ExposureFlashCreditTemplate: React.FC<
  ExposureFlashCreditSchemaType
> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  dimOpacity,
  flashBrightness,
  bandWidth,
  sweepDurationFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;

  /** Exposure band travels from just before the text to just past it, so every
   * character both starts dim and ends fully exposed. */
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

          const exposedAmount = interpolate(dist, [-bandWidth, bandWidth], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(exposedAmount, [0, 1], [dimOpacity, 1]);

          const bump = Math.max(0, 1 - Math.abs(dist) / bandWidth);
          const brightness = 1 + (flashBrightness - 1) * bump;

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                filter: `brightness(${brightness})`,
                textShadow: `0 0 ${bump * 24}px rgba(255,255,255,${bump * 0.9})`,
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

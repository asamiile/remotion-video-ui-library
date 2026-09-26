import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { SignalLockCreditSchemaType } from "./signal-lock-credit.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const SignalLockCreditTemplate: React.FC<SignalLockCreditSchemaType> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  jitterAmplitudePx,
  flickerMinOpacity,
  bandWidth,
  sweepDurationFrames,
  delayFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;

  /** Lock band travels from just before the text to just past it, so every
   * character both starts unlocked and ends fully settled. */
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

          const lockAmount = interpolate(dist, [-bandWidth, bandWidth], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const jitterStrength = 1 - lockAmount;

          const jitterX =
            (random(`${randomSeed}-x-${i}-${frame}`) * 2 - 1) *
            jitterAmplitudePx *
            jitterStrength;
          const jitterY =
            (random(`${randomSeed}-y-${i}-${frame}`) * 2 - 1) *
            jitterAmplitudePx *
            jitterStrength;
          const flickerOpacity =
            flickerMinOpacity +
            random(`${randomSeed}-o-${i}-${frame}`) * (1 - flickerMinOpacity);
          const opacity = interpolate(jitterStrength, [0, 1], [1, flickerOpacity]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                transform: `translate(${jitterX}px, ${jitterY}px)`,
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

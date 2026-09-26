import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { KerningRevealCreditSchemaType } from "./kerning-reveal-credit.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const KerningRevealCreditTemplate: React.FC<
  KerningRevealCreditSchemaType
> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  spreadPx,
  riseFromPx,
  staggerFrames,
  convergeFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();

  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;

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
          const charStartFrame = delayFrames + i * staggerFrames;
          const progress = interpolate(
            frame - charStartFrame,
            [0, convergeFrames],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            },
          );

          const centerOffset = i - (n - 1) / 2;
          const offsetX = centerOffset * spreadPx * (1 - progress);
          const offsetY = riseFromPx * (1 - progress);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: progress,
                transform: `translate(${offsetX}px, ${offsetY}px)`,
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

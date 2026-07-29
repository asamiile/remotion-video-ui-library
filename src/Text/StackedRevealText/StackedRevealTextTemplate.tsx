import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { StackedRevealTextSchemaV1Type } from "./stacked-reveal-text.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const StackedRevealTextTemplateV1: React.FC<
  StackedRevealTextSchemaV1Type
> = ({
  lines,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  textColor,
  backgroundColor,
  orientation,
  lineGapPx,
  holdFramesPerLine,
  lineFadeInFrames,
  haloEnabled,
  haloColor,
  haloBlurPx,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const lineStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    lineHeight,
    color: textColor,
    whiteSpace: "nowrap",
    writingMode: orientation === "vertical" ? "vertical-rl" : "horizontal-tb",
    textShadow: haloEnabled
      ? `0 0 ${haloBlurPx}px ${haloColor}, 0 0 ${haloBlurPx * 2}px ${haloColor}66`
      : "none",
  };

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
          display: "flex",
          flexDirection:
            orientation === "vertical" ? "row-reverse" : "column",
          alignItems: "center",
          gap: lineGapPx,
        }}
      >
        {lines.map((line, i) => {
          const revealAt = i * holdFramesPerLine;
          const localFrame = activeFrame - revealAt;
          const opacity =
            lineFadeInFrames <= 0
              ? localFrame >= 0
                ? 1
                : 0
              : interpolate(localFrame, [0, lineFadeInFrames], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.quad),
                });

          return (
            <p key={i} style={{ ...lineStyle, opacity }}>
              {line}
            </p>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

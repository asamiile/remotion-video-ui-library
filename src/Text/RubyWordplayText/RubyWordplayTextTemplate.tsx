import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { RubyWordplayTextSchemaType } from "./ruby-wordplay-text.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const RubyWordplayTextTemplate: React.FC<
  RubyWordplayTextSchemaType
> = ({
  baseText,
  rubyText,
  fontFamily,
  fontSize,
  rubyFontSize,
  letterSpacing,
  textColor,
  rubyColor,
  backgroundColor,
  rubyDelayFrames,
  fadeInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const baseOpacity = useMemo(() => {
    if (fadeInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInFrames]);

  const rubyFrame = activeFrame - rubyDelayFrames;
  const rubyProgress = interpolate(rubyFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

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
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: baseOpacity,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: rubyFontSize,
            color: rubyColor,
            letterSpacing: "0.1em",
            opacity: rubyProgress,
            transform: `translateY(${(1 - rubyProgress) * 10}px)`,
            marginBottom: 4,
          }}
        >
          {rubyText}
        </div>
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize,
            letterSpacing,
            color: textColor,
          }}
        >
          {baseText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PedigreeCreditTextSchemaType } from "./pedigree-credit-text.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const PedigreeCreditTextTemplate: React.FC<
  PedigreeCreditTextSchemaType
> = ({
  lines,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  textColorStart,
  textColorEnd,
  streakColor,
  streakWidthPercent,
  backgroundColor,
  sweepDurationFrames,
  fadeInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const opacity = useMemo(() => {
    if (fadeInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInFrames]);

  const sweepProgress = useMemo(() => {
    if (activeFrame < 0) {
      return -1;
    }
    const cycle = ((activeFrame % sweepDurationFrames) + sweepDurationFrames) % sweepDurationFrames;
    return cycle / sweepDurationFrames;
  }, [activeFrame, sweepDurationFrames]);

  const streakLeftPercent = interpolate(
    sweepProgress,
    [0, 1],
    [-streakWidthPercent, 100 + streakWidthPercent],
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
          position: "relative",
          opacity,
          overflow: "hidden",
          padding: "4px 2px",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize,
            lineHeight,
            letterSpacing,
            textAlign: "center",
            backgroundImage: `linear-gradient(180deg, ${textColorStart}, ${textColorEnd})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {sweepProgress >= 0 && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${streakLeftPercent}%`,
              width: `${streakWidthPercent}%`,
              background: `linear-gradient(100deg, transparent, ${streakColor}, transparent)`,
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

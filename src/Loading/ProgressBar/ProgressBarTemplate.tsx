import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ProgressBarSchemaType } from "./progress-bar.schema";

export const ProgressBarTemplate: React.FC<ProgressBarSchemaType> = ({
  width,
  height,
  borderRadius,
  trackColor,
  fillColor,
  sweepWidthPercent,
  sweepDurationInFrames,
  showText,
  text,
  textColor,
  fontSize,
  fontFamily,
  fontWeight,
  positionX,
  positionY,
  fadeInDuration,
  fadeOutDuration,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = useMemo(() => {
    if (frame < delayFrames) return 0;

    if (frame < delayFrames + fadeInDuration) {
      return interpolate(
        frame,
        [delayFrames, delayFrames + fadeInDuration],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.ease),
        }
      );
    }

    return interpolate(
      frame,
      [durationInFrames - fadeOutDuration, durationInFrames],
      [1, 0],
      {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
    );
  }, [frame, delayFrames, fadeInDuration, fadeOutDuration, durationInFrames]);

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      left: `${positionX}%`,
      top: `${positionY}%`,
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      opacity,
      zIndex: 2,
    }),
    [positionX, positionY, opacity]
  );

  const textStyle: React.CSSProperties = useMemo(
    () => ({
      color: textColor,
      fontSize,
      fontFamily,
      fontWeight: fontWeight as React.CSSProperties["fontWeight"],
      textShadow: "0px 4px 20px rgba(107, 99, 84, 0.25)",
      margin: 0,
    }),
    [textColor, fontSize, fontFamily, fontWeight]
  );

  const cycleProgress = (frame % sweepDurationInFrames) / sweepDurationInFrames;
  const sweepLeft = interpolate(
    cycleProgress,
    [0, 1],
    [-sweepWidthPercent, 100],
  );

  return (
    <AbsoluteFill>
      <div style={containerStyle}>
        <div
          style={{
            position: "relative",
            width,
            height,
            borderRadius,
            backgroundColor: trackColor,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${sweepLeft}%`,
              width: `${sweepWidthPercent}%`,
              height: "100%",
              borderRadius,
              backgroundColor: fillColor,
            }}
          />
        </div>
        {showText && <p style={textStyle}>{text}</p>}
      </div>
    </AbsoluteFill>
  );
};

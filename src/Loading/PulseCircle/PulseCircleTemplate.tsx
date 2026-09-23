import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { PulseCircleSchemaType } from "./pulse-circle.schema";

export const PulseCircleTemplate: React.FC<PulseCircleSchemaType> = ({
  size,
  coreSizeRatio,
  ringCount,
  strokeWidth,
  color,
  pulseDurationInFrames,
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

  const coreSize = size * coreSizeRatio;

  return (
    <AbsoluteFill>
      <div style={containerStyle}>
        <div style={{ position: "relative", width: size, height: size }}>
          {Array.from({ length: ringCount }).map((_, index) => {
            const phase = (index / ringCount) * pulseDurationInFrames;
            const localFrame = (frame + phase) % pulseDurationInFrames;
            const progress = localFrame / pulseDurationInFrames;
            const scale = interpolate(progress, [0, 1], [coreSizeRatio, 1]);
            const ringOpacity = interpolate(progress, [0, 1], [0.7, 0]);

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `${strokeWidth}px solid ${color}`,
                  transform: `scale(${scale})`,
                  opacity: ringOpacity,
                }}
              />
            );
          })}

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: coreSize,
              height: coreSize,
              borderRadius: "50%",
              backgroundColor: color,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        {showText && <p style={textStyle}>{text}</p>}
      </div>
    </AbsoluteFill>
  );
};

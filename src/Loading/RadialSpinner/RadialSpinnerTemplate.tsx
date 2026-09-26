import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { RadialSpinnerSchemaType } from "./radial-spinner.schema";

export const RadialSpinnerTemplate: React.FC<RadialSpinnerSchemaType> = ({
  size,
  barCount,
  color,
  minOpacity,
  rotationDuration,
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
      textShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
      margin: 0,
    }),
    [textColor, fontSize, fontFamily, fontWeight]
  );

  const rotation = ((frame % rotationDuration) / rotationDuration) * 360;
  const barWidth = size * 0.09;
  const barLength = size * 0.28;
  const innerRadius = size * 0.16;

  return (
    <AbsoluteFill>
      <div style={containerStyle}>
        <div style={{ position: "relative", width: size, height: size }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {Array.from({ length: barCount }).map((_, index) => {
              const angle = (index / barCount) * 360;
              const barOpacity = interpolate(
                index,
                [0, barCount - 1],
                [1, minOpacity],
              );

              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: barWidth,
                    height: barLength,
                    marginLeft: -barWidth / 2,
                    marginTop: -barLength / 2,
                    borderRadius: barWidth / 2,
                    backgroundColor: color,
                    opacity: barOpacity,
                    transform: `rotate(${angle}deg) translateY(-${innerRadius + barLength / 2}px)`,
                  }}
                />
              );
            })}
          </div>
        </div>
        {showText && <p style={textStyle}>{text}</p>}
      </div>
    </AbsoluteFill>
  );
};

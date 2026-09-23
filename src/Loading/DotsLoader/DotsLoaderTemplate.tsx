import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { DotsLoaderSchemaType } from "./dots-loader.schema";

export const DotsLoaderTemplate: React.FC<DotsLoaderSchemaType> = ({
  dotCount,
  dotSize,
  gap,
  color,
  bounceHeight,
  cycleDurationInFrames,
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
      gap: 12,
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

  return (
    <AbsoluteFill>
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap }}>
          {Array.from({ length: dotCount }).map((_, index) => {
            const phase = (index / dotCount) * cycleDurationInFrames;
            const localFrame = (frame + phase) % cycleDurationInFrames;
            const progress = localFrame / cycleDurationInFrames;
            const wave = Math.max(0, Math.sin(progress * Math.PI * 2));
            const scale = 1 + wave * 0.6;
            const lift = wave * bounceHeight;
            const dotOpacity = 0.45 + wave * 0.55;

            return (
              <div
                key={index}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  backgroundColor: color,
                  opacity: dotOpacity,
                  transform: `translateY(${-lift}px) scale(${scale})`,
                }}
              />
            );
          })}
        </div>
        {showText && <p style={textStyle}>{text}</p>}
      </div>
    </AbsoluteFill>
  );
};

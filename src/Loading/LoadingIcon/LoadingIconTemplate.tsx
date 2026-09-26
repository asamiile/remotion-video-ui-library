import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { LoadingIconSchemaType } from "./loading-icon.schema";
import { LoadingIcon } from "./LoadingIcon";

export const LoadingIconTemplate: React.FC<LoadingIconSchemaType> = ({
  size,
  lightColor,
  darkColor,
  strokeWidth,
  showText,
  text,
  textColor,
  fontSize,
  fontFamily,
  fontWeight,
  positionX,
  positionY,
  rotationDuration,
  fadeInDuration,
  fadeOutDuration,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

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
      gap: 8,
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
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <PlaceholderImage />
      </div> */}

      <div style={containerStyle}>
        <LoadingIcon
          size={size}
          lightColor={lightColor}
          darkColor={darkColor}
          strokeWidth={strokeWidth}
          rotationDuration={rotationDuration}
        />
        {showText && <p style={textStyle}>{text}</p>}
      </div>
    </AbsoluteFill>
  );
};

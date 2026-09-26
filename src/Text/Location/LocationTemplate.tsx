import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { LocationSchemaType } from "./location.schema";

const createAnimationProgress = (
  frame: number,
  startFrame: number,
  duration: number,
  easing?: (value: number) => number
) => {
  return interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { 
      extrapolateLeft: 'clamp', 
      extrapolateRight: 'clamp',
      ...(easing && { easing })
    }
  );
};

export const LocationTemplate: React.FC<LocationSchemaType> = ({
  locationName,
  fontSize,
  textColor,
  backgroundColor,
  showBackground,
  textPaddingX,
  textPaddingY,
  lineHeight,
  lineMaxWidth,
  lineSpacing,
  circleSize,
  positionX,
  positionY,
  fontFamily,
  fontWeight,
  animationDurationFrames,
  slideInDistance,
  delayDurationFrames,
  fadeInDurationFrames,
}) => {
  const frame = useCurrentFrame();
  
  const circleOffsetX = circleSize * 1.5;
  const verticalCenter = fontSize / 2 + lineSpacing;
  
  const opacity = createAnimationProgress(
    frame,
    delayDurationFrames,
    fadeInDurationFrames
  );
  
  const slideStartFrame = 0;
  const slideProgress = createAnimationProgress(
    frame,
    slideStartFrame,
    animationDurationFrames
  );

  const easedSlideProgress = interpolate(
    slideProgress,
    [0, 1],
    [0, 1],
    { easing: Easing.out(Easing.quad) }
  );
  const translateXValue = slideInDistance * (1 - easedSlideProgress);

  const lineDelayFrames = 0;
  const lineProgress = createAnimationProgress(
    frame,
    lineDelayFrames,
    animationDurationFrames,
    Easing.out(Easing.quad)
  );
  const lineWidth = lineMaxWidth * lineProgress;
  
  const elementOpacity = Math.max(opacity, lineProgress > 0 ? 1 : 0);

  const absoluteBaseStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 2,
  };

  const textContainerStyle: React.CSSProperties = {
    ...absoluteBaseStyle,
    left: `${positionX}%`,
    top: `${positionY}%`,
    transform: `translate(calc(-${translateXValue}px), -50%)`,
    padding: showBackground ? `${textPaddingY}px ${textPaddingX}px` : "0",
    opacity: opacity,
  };

  const textHeadingStyle: React.CSSProperties = {
    margin: 0,
    fontSize: `${fontSize}px`,
    color: textColor,
    fontFamily: fontFamily,
    fontWeight: fontWeight as React.CSSProperties["fontWeight"],
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    textShadow: "0px 4px 20px rgba(107, 99, 84, 0.25)",
  };

  const circleElementStyle: React.CSSProperties = {
    ...absoluteBaseStyle,
    left: `calc(${positionX}% - ${circleOffsetX}px)`,
    top: `calc(${positionY}% + ${verticalCenter}px)`,
    width: `${circleSize}px`,
    height: `${circleSize}px`,
    backgroundColor: backgroundColor,
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    opacity: elementOpacity,
    boxShadow: "0px 4px 12px 8px rgba(107, 99, 84, 0.25)",
  };

  const lineElementStyle: React.CSSProperties = {
    ...absoluteBaseStyle,
    left: `${positionX}%`,
    top: `calc(${positionY}% + ${verticalCenter}px - ${lineHeight / 2}px)`,
    width: `${lineWidth}px`,
    height: `${lineHeight}px`,
    backgroundColor: backgroundColor,
    transformOrigin: "left center",
    display: "flex",
    alignItems: "center",
    opacity: elementOpacity,
    boxShadow: "0px 4px 12px 8px rgba(107, 99, 84, 0.25)",
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background image - hidden because output is a transparent-background video */}
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

      <div style={textContainerStyle}>
        <h1 style={textHeadingStyle}>
          {locationName}
        </h1>
      </div>

      <div style={circleElementStyle} />

      <div style={lineElementStyle} />
    </AbsoluteFill>
  );
};

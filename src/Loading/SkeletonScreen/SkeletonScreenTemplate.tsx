import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { SkeletonScreenSchemaType } from "./skeleton-screen.schema";

const SkeletonBlock: React.FC<{
  width: number | string;
  height: number;
  borderRadius: number;
  baseColor: string;
  highlightColor: string;
  shimmerX: number;
}> = ({ width, height, borderRadius, baseColor, highlightColor, shimmerX }) => (
  <div
    style={{
      position: "relative",
      width,
      height,
      borderRadius,
      backgroundColor: baseColor,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "60%",
        height: "100%",
        transform: `translateX(${shimmerX}%)`,
        background: `linear-gradient(90deg, transparent, ${highlightColor}, transparent)`,
      }}
    />
  </div>
);

export const SkeletonScreenTemplate: React.FC<SkeletonScreenSchemaType> = ({
  layout,
  width,
  baseColor,
  highlightColor,
  borderRadius,
  lineCount,
  shimmerDurationInFrames,
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
      width,
      opacity,
      zIndex: 2,
    }),
    [positionX, positionY, opacity, width]
  );

  const cycleProgress = (frame % shimmerDurationInFrames) / shimmerDurationInFrames;
  const shimmerX = interpolate(cycleProgress, [0, 1], [-150, 150]);

  const block = (blockWidth: number | string, height: number, radius = borderRadius) => (
    <SkeletonBlock
      width={blockWidth}
      height={height}
      borderRadius={radius}
      baseColor={baseColor}
      highlightColor={highlightColor}
      shimmerX={shimmerX}
    />
  );

  return (
    <AbsoluteFill>
      <div style={containerStyle}>
        {layout === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {block("100%", width * 0.55)}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.from({ length: lineCount }).map((_, index) =>
                <div key={index}>
                  {block(index === lineCount - 1 ? "55%" : "100%", 18)}
                </div>
              )}
            </div>
          </div>
        )}

        {layout === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {Array.from({ length: lineCount }).map((_, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {block(48, 48, 999)}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {block("70%", 16)}
                  {block("45%", 14)}
                </div>
              </div>
            ))}
          </div>
        )}

        {layout === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: lineCount }).map((_, index) =>
              <div key={index}>
                {block(index === lineCount - 1 ? "60%" : "100%", 16)}
              </div>
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

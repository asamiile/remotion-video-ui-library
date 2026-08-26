import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  zoomBlurTransitionAnimationDurationFrames,
  ZoomBlurTransitionSchemaType,
} from "./zoom-blur-transition.schema";
import { resolveCompositionBackdropColor } from "../../../../helpers/transparent-composition-backdrop";

export const ZoomBlurTransitionTemplate: React.FC<
  ZoomBlurTransitionSchemaType
> = ({ backgroundColor, panelColor, panelSizePx, maxBlurPx, zoomScale }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const animationStartFrame = Math.floor(
    (durationInFrames - zoomBlurTransitionAnimationDurationFrames) / 2,
  );
  const animationFrame = frame - animationStartFrame;

  if (
    animationFrame < 0 ||
    animationFrame >= zoomBlurTransitionAnimationDurationFrames
  ) {
    return null;
  }

  const progress = interpolate(animationFrame, [0, zoomBlurTransitionAnimationDurationFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const scale = 1 + (zoomScale - 1) * progress;
  const blurPx = maxBlurPx * progress;
  const opacity = interpolate(progress, [0, 0.6, 1], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
          width: panelSizePx,
          height: panelSizePx,
          borderRadius: "50%",
          backgroundColor: panelColor,
          transform: `scale(${scale})`,
          filter: `blur(${blurPx}px)`,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

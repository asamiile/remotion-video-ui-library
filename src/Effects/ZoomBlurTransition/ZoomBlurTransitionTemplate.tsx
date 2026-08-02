import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ZoomBlurTransitionSchemaType } from "./zoom-blur-transition.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const ZoomBlurTransitionTemplate: React.FC<
  ZoomBlurTransitionSchemaType
> = ({ backgroundColor, panelColor, panelSizePx, maxBlurPx, zoomScale }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
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

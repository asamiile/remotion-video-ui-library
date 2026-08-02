import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CircularNeonLogoFrameSchemaType } from "./circular-neon-logo-frame.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const CircularNeonLogoFrameTemplate: React.FC<
  CircularNeonLogoFrameSchemaType
> = ({
  logoText,
  ringColor,
  ringThicknessPx,
  ringDiameterPx,
  ringGlowPx,
  fontFamily,
  fontSize,
  textColor,
  textGlowPx,
  backgroundColor,
  popInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const popIn = useMemo(() => {
    if (popInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, popInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }, [activeFrame, popInFrames]);

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
          width: ringDiameterPx,
          height: ringDiameterPx,
          borderRadius: "50%",
          border: `${ringThicknessPx}px solid ${ringColor}`,
          boxShadow: `0 0 ${ringGlowPx}px ${ringColor}, inset 0 0 ${ringGlowPx}px ${ringColor}`,
          opacity: popIn,
          transform: `scale(${0.85 + popIn * 0.15})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize,
            color: textColor,
            textShadow: `0 0 ${textGlowPx}px ${textColor}, 0 0 ${textGlowPx * 2}px ${textColor}88`,
            textAlign: "center",
          }}
        >
          {logoText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

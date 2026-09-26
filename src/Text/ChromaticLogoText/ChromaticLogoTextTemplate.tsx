import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ChromaticLogoTextSchemaType } from "./chromatic-logo-text.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const ChromaticLogoTextTemplate: React.FC<
  ChromaticLogoTextSchemaType
> = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  textColor,
  channelAColor,
  channelBColor,
  offsetPx,
  pulseAmplitudePx,
  pulseSpeed,
  backgroundColor,
  fadeInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const opacity = useMemo(() => {
    if (fadeInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInFrames]);

  const offset =
    offsetPx +
    (pulseAmplitudePx > 0
      ? Math.sin(activeFrame / pulseSpeed) * pulseAmplitudePx
      : 0);

  const textStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", display: "inline-block", opacity }}>
        <p
          style={{
            ...textStyle,
            position: "absolute",
            left: -offset,
            top: 0,
            color: channelAColor as string,
            zIndex: 0,
          }}
        >
          {text}
        </p>
        <p
          style={{
            ...textStyle,
            position: "absolute",
            left: offset,
            top: 0,
            color: channelBColor as string,
            zIndex: 0,
          }}
        >
          {text}
        </p>
        <p
          style={{
            ...textStyle,
            position: "relative",
            color: textColor,
            zIndex: 1,
          }}
        >
          {text}
        </p>
      </div>
    </AbsoluteFill>
  );
};

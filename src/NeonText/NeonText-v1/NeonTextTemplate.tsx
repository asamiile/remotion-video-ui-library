import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { NeonTextSchemaV1Type } from "./neon-text-schema";

function buildNeonTextShadow(
  glowColor: string,
  haloColor: string,
  strength: number,
  pulseScale: number,
): string {
  const s = strength * pulseScale;
  return [
    `0 0 ${6 * s}px ${glowColor}`,
    `0 0 ${14 * s}px ${glowColor}`,
    `0 0 ${28 * s}px ${haloColor}`,
    `0 0 ${48 * s}px ${haloColor}`,
    `0 0 ${72 * s}px ${haloColor}99`,
  ].join(", ");
}

export const NeonTextTemplateV1: React.FC<NeonTextSchemaV1Type> = (props) => {
  const frame = useCurrentFrame();
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    coreColor,
    glowColor,
    haloColor,
    tubeStrokeColor,
    tubeStrokeWidth,
    shadowStrength,
    animationMode,
    pulsePeriodFrames,
    breathePeriodFrames,
    flickerStrength,
    randomSeed,
    fadeInDuration,
    delayFrames,
    positionX,
    positionY,
    backgroundColor,
    vignetteOpacity,
  } = props;

  const activeFrame = frame - delayFrames;

  const fadeIn = useMemo(() => {
    if (activeFrame <= 0) {
      return 0;
    }
    if (fadeInDuration <= 0) {
      return 1;
    }
    return interpolate(activeFrame, [0, fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }, [activeFrame, fadeInDuration]);

  const flickerMul = useMemo(() => {
    if (flickerStrength <= 0) {
      return 1;
    }
    const j = random(`${randomSeed}-n-${frame}`);
    return 1 - flickerStrength * j;
  }, [flickerStrength, randomSeed, frame]);

  const pulseScale = useMemo(() => {
    if (activeFrame < 0) {
      return 1;
    }
    if (animationMode === "pulse") {
      const t = (frame % pulsePeriodFrames) / pulsePeriodFrames;
      return 0.88 + 0.12 * Math.sin(t * Math.PI * 2);
    }
    if (animationMode === "breathe") {
      const t = (frame % breathePeriodFrames) / breathePeriodFrames;
      return 0.82 + 0.18 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
    }
    if (animationMode === "flicker") {
      return 0.92 + 0.08 * Math.sin((frame / 11) * Math.PI * 2);
    }
    return 1;
  }, [
    activeFrame,
    animationMode,
    frame,
    pulsePeriodFrames,
    breathePeriodFrames,
  ]);

  const textShadow = useMemo(
    () =>
      buildNeonTextShadow(glowColor, haloColor, shadowStrength, pulseScale),
    [glowColor, haloColor, shadowStrength, pulseScale],
  );

  const labelStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    lineHeight: 1.15,
    color: coreColor,
    WebkitTextStroke: `${tubeStrokeWidth}px ${tubeStrokeColor}`,
    paintOrder: "stroke fill",
    textShadow,
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const mountOpacity = fadeIn * flickerMul;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 55% at 50% 45%, transparent 0%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${positionX}%`,
          top: `${positionY}%`,
          transform: "translate(-50%, -50%)",
          opacity: mountOpacity,
          maxWidth: "92vw",
        }}
      >
        <h1 style={labelStyle}>{text}</h1>
      </div>
    </AbsoluteFill>
  );
};

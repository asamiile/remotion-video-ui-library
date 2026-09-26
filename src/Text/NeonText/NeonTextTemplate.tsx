import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { NeonTextSchemaType } from "./neon-text.schema";
import "../../helpers/font-line-seed-jp";
import { resolvedBackdropPair } from "../../helpers/transparent-composition-backdrop";

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

export const NeonTextTemplate: React.FC<NeonTextSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    coreColor,
    glowColor,
    haloColor,
    neonFillMode,
    neonGradientStops,
    tubeStrokeColor,
    tubeStrokeWidth,
    shadowStrength,
    animationMode,
    pulsePeriodFrames,
    breathePeriodFrames,
    blinkPeriodFrames,
    blinkDutyRatio,
    blinkDimOpacity,
    blinkGlowOffMul,
    flickerStrength,
    randomSeed,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
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
    if (animationMode === "blink" || flickerStrength <= 0) {
      return 1;
    }
    const j = random(`${randomSeed}-n-${frame}`);
    return 1 - flickerStrength * j;
  }, [animationMode, flickerStrength, randomSeed, frame]);

  const blinkState = useMemo(() => {
    if (animationMode !== "blink" || activeFrame < 0) {
      return { opacityMul: 1, glowMul: 1 };
    }
    const period = Math.max(10, blinkPeriodFrames);
    const t = activeFrame % period;
    const onFrames = Math.round(period * blinkDutyRatio);
    const clampedOn = Math.min(Math.max(1, onFrames), period - 1);
    const isOn = t < clampedOn;
    return {
      opacityMul: isOn ? 1 : blinkDimOpacity,
      glowMul: isOn ? 1 : blinkGlowOffMul,
    };
  }, [
    animationMode,
    activeFrame,
    blinkPeriodFrames,
    blinkDutyRatio,
    blinkDimOpacity,
    blinkGlowOffMul,
  ]);

  const pulseScale = useMemo(() => {
    if (activeFrame < 0) {
      return 1;
    }
    if (animationMode === "blink") {
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

  const shadowPulseScale = pulseScale * blinkState.glowMul;

  const useGradient =
    neonFillMode === "gradient" &&
    Array.isArray(neonGradientStops) &&
    neonGradientStops.length >= 2;

  const gradientCss = useGradient
    ? `linear-gradient(to right, ${neonGradientStops!.join(", ")})`
    : undefined;

  const shadowGlowColor = useGradient ? neonGradientStops![0]! : glowColor;
  const shadowHaloColor =
    useGradient ? neonGradientStops![neonGradientStops!.length - 1]! : haloColor;

  const textShadow = useMemo(
    () =>
      buildNeonTextShadow(
        shadowGlowColor,
        shadowHaloColor,
        shadowStrength,
        shadowPulseScale,
      ),
    [shadowGlowColor, shadowHaloColor, shadowStrength, shadowPulseScale],
  );

  const labelStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    lineHeight,
    ...(useGradient
      ? {
          backgroundImage: gradientCss,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }
      : { color: coreColor }),
    WebkitTextStroke: `${tubeStrokeWidth}px ${tubeStrokeColor}`,
    paintOrder: "stroke fill",
    textShadow,
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  const mountOpacity = fadeIn * flickerMul * blinkState.opacityMul;

  const { backdropColor, vignette } = resolvedBackdropPair(
    backgroundColor,
    vignetteOpacity,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: backdropColor }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 68% 56% at 50% 48%, transparent 0%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${paddingLeftPercent}%`,
          bottom: `${paddingBottomPercent}%`,
          opacity: mountOpacity,
          maxWidth: `${100 - paddingLeftPercent - 2}%`,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            isolation: "isolate",
          }}
        >
          <h1 style={labelStyle}>{text}</h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};

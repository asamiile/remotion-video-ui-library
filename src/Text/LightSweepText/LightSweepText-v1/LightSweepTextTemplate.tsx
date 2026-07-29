import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { LightSweepTextSchemaV1Type } from "./light-sweep-text.schema";
import "../../../helpers/line-seed-jp";
import { resolvedBackdropPair } from "../../../helpers/transparent-composition-backdrop";

function pickSweepEasing(mode: LightSweepTextSchemaV1Type["sweepEasing"]) {
  if (mode === "linear") {
    return Easing.linear;
  }
  if (mode === "easeInOut") {
    return Easing.inOut(Easing.cubic);
  }
  return Easing.out(Easing.cubic);
}

export const LightSweepTextTemplateV1: React.FC<LightSweepTextSchemaV1Type> = (
  props,
) => {
  const frame = useCurrentFrame();
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    baseTextColor,
    activeTextColor,
    sweepStartFrame,
    sweepDurationFrames,
    sweepEasing,
    sweepBandWidthPercent,
    sweepBandTiltDeg,
    softGlowBlur,
    softGlowOpacity,
    completionGlowFrames,
    completionGlowStrength,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
    backgroundColor,
    vignetteOpacity,
  } = props;

  const activeFrame = frame - delayFrames;

  const mountFade = useMemo(() => {
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

  const sweepT = interpolate(
    activeFrame,
    [sweepStartFrame, sweepStartFrame + sweepDurationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: pickSweepEasing(sweepEasing),
    },
  );

  const sweepXPercent = interpolate(sweepT, [0, 1], [-8, 108]);

  const sweepEndFrame = sweepStartFrame + sweepDurationFrames;
  const postSweep = activeFrame - sweepEndFrame;
  const completionPhase =
    postSweep < 0
      ? 0
      : interpolate(
          postSweep,
          [0, Math.max(1, completionGlowFrames * 0.45)],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

  const textColor = interpolateColors(
    Math.min(1, sweepT + completionPhase * 0.35),
    [0, 1],
    [baseTextColor, activeTextColor],
  );

  const glowMul =
    postSweep >= 0 && completionGlowFrames > 0
      ? interpolate(
          postSweep,
          [0, completionGlowFrames * 0.5, completionGlowFrames],
          [1.35, 1.08, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 1;

  const textShadow =
    glowMul > 1.01
      ? [
          `0 0 ${8 * glowMul * completionGlowStrength}px rgba(160, 220, 255, 0.65)`,
          `0 0 ${22 * glowMul * completionGlowStrength}px rgba(100, 180, 255, 0.35)`,
        ].join(", ")
      : "none";

  const o = softGlowOpacity;
  /** No sharp peak — the gradient is deliberately wide so it doesn't read as a hard vertical line */
  const sweepBody = `linear-gradient(90deg,
    rgba(255,255,255,0) 0%,
    rgba(220, 240, 255, 0) 10%,
    rgba(190, 228, 255, ${0.14 * o}) 30%,
    rgba(255, 255, 255, ${0.38 * o}) 50%,
    rgba(190, 228, 255, ${0.14 * o}) 70%,
    rgba(220, 240, 255, 0) 90%,
    rgba(255,255,255,0) 100%)`;

  /** A wider, weaker glow layered on top to blur the edges further (layering two gradients produces just a soft bleed, no visible edge) */
  const sweepHalo = `linear-gradient(90deg,
    rgba(255,255,255,0) 0%,
    rgba(200, 230, 255, 0) 18%,
    rgba(210, 235, 255, ${0.06 * o}) 45%,
    rgba(200, 230, 255, 0) 82%,
    rgba(255,255,255,0) 100%)`;

  const labelStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    lineHeight,
    color: textColor,
    textAlign: "left",
    textShadow,
    whiteSpace: "pre-line",
  };

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
          opacity: mountFade,
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
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${sweepXPercent}%`,
                top: "-40%",
                width: `${sweepBandWidthPercent * 1.35}%`,
                height: "180%",
                transform: `translateX(-50%) rotate(${sweepBandTiltDeg}deg)`,
                transformOrigin: "center center",
                background: sweepHalo,
                mixBlendMode: "screen",
                filter: `blur(${softGlowBlur * 1.35}px)`,
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${sweepXPercent}%`,
                top: "-38%",
                width: `${sweepBandWidthPercent}%`,
                height: "176%",
                transform: `translateX(-50%) rotate(${sweepBandTiltDeg}deg)`,
                transformOrigin: "center center",
                background: sweepBody,
                mixBlendMode: "screen",
                filter: `blur(${softGlowBlur}px)`,
                opacity: 0.92,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

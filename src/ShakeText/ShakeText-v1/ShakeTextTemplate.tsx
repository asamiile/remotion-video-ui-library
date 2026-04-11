import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ShakeTextSchemaV1Type } from "./shake-text-schema";
import "../../helpers/jetbrains-mono";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const ShakeTextTemplateV1: React.FC<ShakeTextSchemaV1Type> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    textColor,
    jitterMaxPx,
    rotationMaxDeg,
    burstSegmentFrames,
    burstProbability,
    burstIntensityMul,
    randomSeed,
    settleDurationFrames,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
    backgroundColor,
  } = props;

  const activeFrame = frame - delayFrames;

  const fade = useMemo(() => {
    if (activeFrame <= 0) {
      return 0;
    }
    if (fadeInDuration <= 0) {
      return 1;
    }
    return interpolate(activeFrame, [0, fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInDuration]);

  const settleMul =
    settleDurationFrames > 0
      ? interpolate(
          frame,
          [
            durationInFrames - settleDurationFrames,
            durationInFrames - 1,
          ],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 1;

  const { dx, dy, deg } = useMemo(() => {
    if (activeFrame < 0) {
      return { dx: 0, dy: 0, deg: 0 };
    }
    const seg = Math.floor(activeFrame / burstSegmentFrames);
    const burst = random(`${randomSeed}-burst-${seg}`) < burstProbability;
    const burstMul = burst ? burstIntensityMul : 1;
    const f = activeFrame;
    const rx = (random(`${randomSeed}-jx-${f}`) - 0.5) * 2;
    const ry = (random(`${randomSeed}-jy-${f}`) - 0.5) * 2;
    const rr = (random(`${randomSeed}-jr-${f}`) - 0.5) * 2;
    return {
      dx: rx * jitterMaxPx * burstMul,
      dy: ry * jitterMaxPx * burstMul,
      deg: rr * rotationMaxDeg * burstMul,
    };
  }, [
    activeFrame,
    burstProbability,
    burstSegmentFrames,
    burstIntensityMul,
    jitterMaxPx,
    randomSeed,
    rotationMaxDeg,
  ]);

  const amp = settleMul;

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
    whiteSpace: "pre-line",
    transform: `translate(${dx * amp}px, ${dy * amp}px) rotate(${deg * amp}deg)`,
    willChange: "transform",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}>
      <div
        style={{
          position: "absolute",
          left: `${paddingLeftPercent}%`,
          bottom: `${paddingBottomPercent}%`,
          opacity: fade,
          maxWidth: `${100 - paddingLeftPercent - 2}%`,
        }}
      >
        <h1 style={labelStyle}>{text}</h1>
      </div>
    </AbsoluteFill>
  );
};

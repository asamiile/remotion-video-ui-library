import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ConfettiPopTextSchemaType } from "./confetti-pop-text.schema";
import "../../helpers/jetbrains-mono";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const CONFETTI_PALETTE = [
  "#ff6b9d",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#c084fc",
  "#fff1c1",
  "#ff8fab",
  "#95e1d3",
];

type ParticleSpec = {
  angle: number;
  speed: number;
  sizeW: number;
  sizeH: number;
  color: string;
  spin: number;
};

function buildParticles(
  count: number,
  seed: string,
): ParticleSpec[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: random(`${seed}-a-${i}`) * Math.PI * 2,
    speed: 0.75 + random(`${seed}-s-${i}`) * 0.55,
    sizeW: 7 + random(`${seed}-w-${i}`) * 12,
    sizeH: 4 + random(`${seed}-h-${i}`) * 7,
    color:
      CONFETTI_PALETTE[
        Math.floor(random(`${seed}-c-${i}`) * CONFETTI_PALETTE.length)
      ] ?? "#ffd93d",
    spin: (random(`${seed}-p-${i}`) - 0.5) * 720,
  }));
}

export const ConfettiPopTextTemplateV1: React.FC<ConfettiPopTextSchemaType> = (
  props,
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    textColor,
    burstFrame,
    flashPeakOpacity,
    flashDurationFrames,
    glowDurationFrames,
    particleCount,
    showShockwaveRing,
    particleLifeFrames,
    particleSpread,
    particleGravity,
    randomSeed,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
    backgroundColor,
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
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInDuration]);

  const pop = spring({
    frame: Math.max(0, activeFrame),
    fps,
    delay: burstFrame,
    config: { damping: 13, mass: 0.72, stiffness: 128 },
    from: 0,
    to: 1,
  });

  const scale = 0.28 + 0.72 * Math.min(pop, 1.08);
  const textOpacity = activeFrame < burstFrame ? 0 : Math.min(1, pop * 1.05);

  const rel = activeFrame - burstFrame;

  const flashOpacity =
    rel >= 0
      ? interpolate(
          rel,
          [0, 1, flashDurationFrames],
          [flashPeakOpacity, flashPeakOpacity * 0.5, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  const glowStrength =
    rel >= 0
      ? interpolate(rel, [0, glowDurationFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const textShadow =
    glowStrength > 0.02
      ? [
          `0 0 ${16 * glowStrength}px rgba(255, 220, 170, ${0.75 * glowStrength})`,
          `0 0 ${44 * glowStrength}px rgba(255, 180, 90, ${0.4 * glowStrength})`,
        ].join(", ")
      : "none";

  const particles = useMemo(
    () =>
      particleCount > 0
        ? buildParticles(particleCount, randomSeed)
        : ([] as ParticleSpec[]),
    [particleCount, randomSeed],
  );

  const ringScale =
    showShockwaveRing && rel >= 0
      ? interpolate(rel, [0, 30], [0.2, 2.35], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const ringOpacity =
    showShockwaveRing && rel >= 0
      ? interpolate(rel, [0, 6, 30], [0.5, 0.28, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const labelStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    position: "relative",
    zIndex: 4,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    lineHeight,
    color: textColor,
    textAlign: "left",
    whiteSpace: "pre-line",
    transform: `scale(${scale})`,
    opacity: textOpacity,
    textShadow,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}>
      {flashOpacity > 0.005 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundColor: `rgba(255, 252, 245, ${flashOpacity})`,
            zIndex: 10,
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          left: `${paddingLeftPercent}%`,
          bottom: `${paddingBottomPercent}%`,
          opacity: mountFade,
          display: "inline-block",
          minWidth: 120,
          minHeight: 80,
          maxWidth: `${100 - paddingLeftPercent - 2}%`,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "block",
          }}
        >
          {showShockwaveRing && ringOpacity > 0.02 ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 130,
                height: 130,
                marginLeft: -65,
                marginTop: -65,
                borderRadius: "50%",
                border: `3px solid rgba(255, 230, 210, ${ringOpacity})`,
                transform: `scale(${ringScale})`,
                transformOrigin: "50% 50%",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          ) : null}

          {particleCount > 0 && rel >= 0 ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 4,
                height: 4,
                marginLeft: -2,
                marginTop: -2,
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              {particles.map((p, i) => {
                const t = rel;
                const vx = Math.cos(p.angle) * p.speed * particleSpread * 4.2;
                const vy = Math.sin(p.angle) * p.speed * particleSpread * 4.2;
                const x = vx * t * 0.38;
                const y =
                  vy * t * 0.38 + particleGravity * t * t * 0.095;
                const life = interpolate(
                  t,
                  [
                    0,
                    particleLifeFrames * 0.75,
                    particleLifeFrames,
                  ],
                  [1, 0.45, 0],
                  { extrapolateRight: "clamp" },
                );
                const rot = (p.spin * t) / 24;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: x,
                      top: y,
                      width: p.sizeW,
                      height: p.sizeH,
                      marginLeft: -p.sizeW / 2,
                      marginTop: -p.sizeH / 2,
                      backgroundColor: p.color,
                      borderRadius: 2,
                      opacity: life,
                      transform: `rotate(${rot}deg)`,
                      boxShadow: "0 0 4px rgba(0,0,0,0.15)",
                    }}
                  />
                );
              })}
            </div>
          ) : null}

          <h1 style={labelStyle}>{text}</h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};

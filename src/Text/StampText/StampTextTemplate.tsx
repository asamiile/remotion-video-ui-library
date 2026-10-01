import React, { useId, useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import "../../helpers/font-line-seed-jp";
import "../../helpers/font-space-grotesk";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import type { StampTextSchemaType } from "./stamp-text.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Rubber-stamp title. The stamp drops in from above the page (large and
 * faint), lands at impactFrames with a squash and a decaying jolt, and leaves
 * a worn ink impression: an SVG filter roughens the edges (displacement) and
 * knocks holes in the ink (thresholded turbulence used as an alpha mask).
 * Ink splatters appear around the border on impact.
 */
export const StampTextTemplate: React.FC<StampTextSchemaType> = ({
  text,
  subText,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  inkColor,
  backgroundColor,
  border,
  rotationDeg,
  roughness,
  inkWear,
  splatterCount,
  impactFrames,
  shakePx,
  delayFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const filterId = `stamp${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const f = frame - delayFrames;
  const seedNumber = Math.floor(random(`${randomSeed}-filter`) * 1000);

  // Drop: big and faint → full size at impact, then a small squash.
  const drop = interpolate(f, [0, impactFrames], [1.55, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const squash = interpolate(f - impactFrames, [0, 2, 6], [1, 0.965, 1], clamp);
  const opacity = interpolate(f, [0, impactFrames * 0.7, impactFrames], [0, 0.35, 1], clamp);
  const since = f - impactFrames;
  const jolt = since >= 0 ? shakePx * Math.exp(-since / 3.5) : 0;
  const shakeX = jolt * Math.sin(since * 2.6);
  const shakeY = jolt * Math.cos(since * 3.3) * 0.6;
  // Holes threshold: higher wear opens more holes in the ink.
  const threshold = 0.78 - 0.32 * inkWear;

  const splatters = useMemo(
    () =>
      Array.from({ length: splatterCount }).map((_, i) => {
        const a = random(`${randomSeed}-sa-${i}`) * Math.PI * 2;
        const r = 0.52 + random(`${randomSeed}-sr-${i}`) * 0.18;
        return {
          left: 50 + Math.cos(a) * r * 100,
          top: 50 + Math.sin(a) * r * 100,
          size: 2 + random(`${randomSeed}-ss-${i}`) * 7,
        };
      }),
    [splatterCount, randomSeed],
  );

  if (f < 0) {
    return <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }} />;
  }

  const borderWidth = Math.max(6, fontSize * 0.09);
  const frameStyle: React.CSSProperties =
    border === "none"
      ? {}
      : border === "circle"
        ? {
            border: `${borderWidth}px solid ${inkColor}`,
            borderRadius: "50%",
            aspectRatio: "1 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: fontSize * 0.5,
          }
        : {
            border: `${border === "double" ? borderWidth * 2 : borderWidth}px ${border === "double" ? "double" : "solid"} ${inkColor}`,
            borderRadius: fontSize * 0.08,
            padding: `${fontSize * 0.18}px ${fontSize * 0.32}px`,
          };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={0.045} numOctaves={2} seed={seedNumber} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={roughness} xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency={0.09} numOctaves={4} seed={seedNumber + 7} result="wear" />
            <feColorMatrix
              in="wear"
              type="matrix"
              values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -14 0 0 0 ${14 * threshold}`}
              result="wearMask"
            />
            <feComposite in="rough" in2="wearMask" operator="in" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: "relative",
          transform: `translate(${shakeX}px, ${shakeY}px) rotate(${rotationDeg}deg) scale(${drop * squash})`,
          opacity,
        }}
      >
        <div style={{ filter: `url(#${filterId})`, opacity: 0.94 }}>
          <div style={{ ...frameStyle, color: inkColor, textAlign: "center" }}>
            <div>
              <div
                style={{
                  fontFamily,
                  fontWeight,
                  fontSize,
                  letterSpacing,
                  lineHeight: 1,
                  whiteSpace: "pre",
                }}
              >
                {text}
              </div>
              {subText ? (
                <div
                  style={{
                    fontFamily,
                    fontWeight,
                    fontSize: fontSize * 0.28,
                    letterSpacing: "0.2em",
                    marginTop: fontSize * 0.12,
                    whiteSpace: "pre",
                  }}
                >
                  {subText}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {since >= 0
          ? splatters.map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size * (0.7 + (i % 3) * 0.2),
                  borderRadius: "50%",
                  backgroundColor: inkColor,
                  opacity: 0.85,
                }}
              />
            ))
          : null}
      </div>
    </AbsoluteFill>
  );
};

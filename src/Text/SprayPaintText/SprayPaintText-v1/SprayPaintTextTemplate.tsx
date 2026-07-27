import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { SprayPaintTextSchemaV1Type } from "./spray-paint-text-schema";
import "../../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

/**
 * Spray-can/graffiti-style credit text with drip marks (modeled on an
 * analysis of the Persona 5 opening animation's staff-credit typography).
 * The rough edge comes from an SVG feTurbulence + feDisplacementMap filter
 * (no image asset required); drips are procedurally placed rounded bars
 * hanging from the text's baseline.
 */
export const SprayPaintTextTemplateV1: React.FC<
  SprayPaintTextSchemaV1Type
> = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  roughness,
  dripCount,
  dripColor,
  dripMaxLengthPx,
  fadeInFrames,
  delayFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const filterId = useId().replace(/:/g, "");
  const activeFrame = frame - delayFrames;

  const opacity =
    fadeInFrames <= 0
      ? activeFrame >= 0
        ? 1
        : 0
      : interpolate(activeFrame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        });

  const drips = useMemo(
    () =>
      Array.from({ length: dripCount }).map((_, i) => {
        const leftPercent = 8 + random(`${randomSeed}-drip-x-${i}`) * 84;
        const length =
          dripMaxLengthPx * (0.35 + random(`${randomSeed}-drip-l-${i}`) * 0.65);
        const widthPx = 3 + random(`${randomSeed}-drip-w-${i}`) * 5;
        return { leftPercent, length, widthPx };
      }),
    [dripCount, dripMaxLengthPx, randomSeed],
  );

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
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.05}
              numOctaves={2}
              seed={3}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={roughness}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div style={{ position: "relative", opacity }}>
        <div
          style={{
            fontFamily,
            fontWeight: fontWeight as string,
            fontSize,
            letterSpacing,
            color: textColor,
            whiteSpace: "pre-wrap",
            textAlign: "center",
            filter: roughness > 0 ? `url(#${filterId})` : undefined,
          }}
        >
          {text}
        </div>

        {drips.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "100%",
              left: `${d.leftPercent}%`,
              width: d.widthPx,
              height: d.length,
              backgroundColor: dripColor ?? textColor,
              borderRadius: d.widthPx,
              filter: roughness > 0 ? `url(#${filterId})` : undefined,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

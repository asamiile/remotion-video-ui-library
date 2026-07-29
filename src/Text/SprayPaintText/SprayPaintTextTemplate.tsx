import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { SprayPaintTextSchemaType } from "./spray-paint-text.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const OVERSPRAY_WINDOW_FRAMES = 7;

/**
 * Spray-can/graffiti-style credit text with drip marks (modeled on an
 * analysis of the Persona 5 opening animation's staff-credit typography).
 * The rough edge comes from an SVG feTurbulence + feDisplacementMap filter
 * (no image asset required); drips are procedurally placed rounded bars
 * hanging from the text's baseline.
 *
 * The left-to-right "spray pass" reveal (jagged mask wipe + trailing
 * overspray specks, plus drips growing in once the pass reaches them) is an
 * artistic embellishment: the source PV this is modeled on hard-cuts to a
 * fully-formed, static credit graphic with no reveal animation of its own.
 */
export const SprayPaintTextTemplate: React.FC<
  SprayPaintTextSchemaType
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
  dripGrowFrames,
  revealFrames,
  oversprayCount,
  oversprayColor,
  delayFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const filterId = useId().replace(/:/g, "");
  const activeFrame = frame - delayFrames;

  const revealProgress = interpolate(
    activeFrame,
    [0, revealFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Feathered edge (not a hard cutoff) so the wipe reads as a soft spray-mist
  // boundary. leadingEdge overshoots 100% as progress nears 1 so the reveal
  // ends fully opaque instead of fading out its own tail.
  const featherPercent = 8;
  const leadingEdgePercent = revealProgress * (100 + featherPercent);
  const solidEdgePercent = Math.max(0, leadingEdgePercent - featherPercent);
  const revealMaskImage = `linear-gradient(to right, black 0%, black ${solidEdgePercent}%, transparent ${leadingEdgePercent}%)`;

  const drips = useMemo(
    () =>
      Array.from({ length: dripCount }).map((_, i) => {
        const leftPercent = 8 + random(`${randomSeed}-drip-x-${i}`) * 84;
        const length =
          dripMaxLengthPx * (0.35 + random(`${randomSeed}-drip-l-${i}`) * 0.65);
        const widthPx = 3 + random(`${randomSeed}-drip-w-${i}`) * 5;
        const reachFrame = (leftPercent / 100) * revealFrames;
        return { leftPercent, length, widthPx, reachFrame };
      }),
    [dripCount, dripMaxLengthPx, randomSeed, revealFrames],
  );

  const oversprayDots = useMemo(
    () =>
      Array.from({ length: oversprayCount }).map((_, i) => {
        const fraction = random(`${randomSeed}-spray-f-${i}`);
        const topPercent = random(`${randomSeed}-spray-y-${i}`) * 100;
        const sizePx = 2 + random(`${randomSeed}-spray-s-${i}`) * 4;
        const jitterPercent =
          (random(`${randomSeed}-spray-j-${i}`) - 0.5) * 6;
        return {
          thresholdFrame: fraction * revealFrames,
          leftPercent: fraction * 100 + jitterPercent,
          topPercent,
          sizePx,
        };
      }),
    [oversprayCount, randomSeed, revealFrames],
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

      {/* Shrink-wraps to the text's rendered size so the reveal mask + overspray
          dots below can both be positioned with percentages relative to it. */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            display: "inline-block",
            maskImage: revealMaskImage,
            WebkitMaskImage: revealMaskImage,
          }}
        >
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

          {drips.map((d, i) => {
            const growProgress = interpolate(
              activeFrame,
              [d.reachFrame, d.reachFrame + dripGrowFrames],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              },
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: `${d.leftPercent}%`,
                  width: d.widthPx,
                  height: d.length * growProgress,
                  backgroundColor: dripColor ?? textColor,
                  borderRadius: d.widthPx,
                  filter: roughness > 0 ? `url(#${filterId})` : undefined,
                }}
              />
            );
          })}
        </div>

        {oversprayDots.map((dot, i) => {
          const localFrame = activeFrame - dot.thresholdFrame;
          const opacity = interpolate(
            localFrame,
            [0, OVERSPRAY_WINDOW_FRAMES * 0.4, OVERSPRAY_WINDOW_FRAMES],
            [0, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          if (opacity <= 0) {
            return null;
          }
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${dot.leftPercent}%`,
                top: `${dot.topPercent}%`,
                width: dot.sizePx,
                height: dot.sizePx,
                borderRadius: "50%",
                backgroundColor: oversprayColor ?? textColor,
                opacity,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

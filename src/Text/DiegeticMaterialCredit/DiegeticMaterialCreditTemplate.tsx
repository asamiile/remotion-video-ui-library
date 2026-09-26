import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { DiegeticMaterialCreditSchemaType } from "./diegetic-material-credit.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const DiegeticMaterialCreditTemplate: React.FC<
  DiegeticMaterialCreditSchemaType
> = ({
  variant,
  creditName,
  roleLabel,
  fontFamily,
  fontSize,
  roleFontSize,
  scriptColor,
  engravedColor,
  engravedPlateColor,
  graffitiColor,
  backgroundColor,
  backdropColor,
  backdropBlurPx,
  dripCount,
  randomSeed,
  fadeInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;
  const filterId = useId().replace(/:/g, "");

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

  const drips = useMemo(() => {
    if (variant !== "graffiti" || dripCount <= 0) {
      return [];
    }
    return new Array(dripCount).fill(0).map((_, i) => ({
      leftPercent: 5 + random(`${randomSeed}-drip-x-${i}`) * 90,
      heightPx: 10 + random(`${randomSeed}-drip-h-${i}`) * 40,
      widthPx: 2 + random(`${randomSeed}-drip-w-${i}`) * 3,
    }));
  }, [variant, dripCount, randomSeed]);

  const isScript = variant === "script";
  const isEngraved = variant === "engraved";
  const isGraffiti = variant === "graffiti";

  const textColor = isScript
    ? scriptColor
    : isEngraved
      ? engravedColor
      : graffitiColor;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          backgroundColor: backdropColor,
          filter: `blur(${backdropBlurPx}px)`,
          opacity: 0.7,
        }}
      />

      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.06}
              numOctaves={2}
              seed={5}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isGraffiti ? 6 : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: "relative",
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isEngraved ? "24px 48px" : 0,
          backgroundColor: isEngraved ? engravedPlateColor : "transparent",
          borderRadius: isEngraved ? 4 : 0,
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: isEngraved ? 400 : 700,
            fontStyle: isScript ? "italic" : "normal",
            fontSize,
            color: textColor,
            filter: isGraffiti ? `url(#${filterId})` : undefined,
            textShadow: isEngraved
              ? `1px 1px 0px rgba(0,0,0,0.6), -1px -1px 0px rgba(255,255,255,0.15)`
              : isScript
                ? `0 0 8px ${scriptColor}66`
                : "none",
            letterSpacing: isEngraved ? "0.08em" : "0.01em",
          }}
        >
          {creditName}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: roleFontSize,
            color: textColor,
            opacity: 0.75,
            marginTop: 6,
            letterSpacing: "0.04em",
          }}
        >
          {roleLabel}
        </div>

        {isGraffiti &&
          drips.map((drip, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "100%",
                left: `${drip.leftPercent}%`,
                width: drip.widthPx,
                height: drip.heightPx,
                backgroundColor: graffitiColor as string,
                borderRadius: "0 0 50% 50%",
              }}
            />
          ))}
      </div>
    </AbsoluteFill>
  );
};

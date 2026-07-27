import React, { useId } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DistressedTitleCardSchemaV1Type } from "./distressed-title-card-schema";
import "../../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

export const DistressedTitleCardTemplateV1: React.FC<
  DistressedTitleCardSchemaV1Type
> = ({
  variant,
  titleText,
  numberText,
  fontFamily,
  numberFontFamily,
  fontSize,
  numberFontSize,
  letterSpacing,
  darkBackgroundColor,
  darkTextColor,
  paperBackgroundColor,
  paperTextColor,
  numberGradientFrom,
  numberGradientTo,
  distressAmount,
  fadeInFrames,
  delayFrames,
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

  const isDark = variant === "darkTitle";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(
          isDark ? darkBackgroundColor : paperBackgroundColor,
        ),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.012}
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distressAmount}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {!isDark && (
          <div
            style={{
              fontFamily: numberFontFamily,
              fontWeight: 700,
              fontSize: numberFontSize,
              lineHeight: 1,
              backgroundImage: `linear-gradient(180deg, ${numberGradientFrom}, ${numberGradientTo})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {numberText}
          </div>
        )}

        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize,
            letterSpacing,
            textTransform: isDark ? "uppercase" : "none",
            color: isDark ? darkTextColor : paperTextColor,
            filter: distressAmount > 0 ? `url(#${filterId})` : undefined,
            whiteSpace: "pre-wrap",
            textAlign: "center",
          }}
        >
          {titleText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

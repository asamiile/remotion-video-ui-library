import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EmergingNoiseTitleSchemaType } from "./emerging-noise-title.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const EmergingNoiseTitleTemplate: React.FC<
  EmergingNoiseTitleSchemaType
> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  buildFrames,
  delayFrames,
  wordFragments,
  fragmentColor,
  fragmentFontSize,
  fragmentFlashFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const activeFrame = frame - delayFrames;

  const charsRevealed = Math.floor(
    interpolate(activeFrame, [0, buildFrames], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const fragments = useMemo(() => {
    return wordFragments.map((word, i) => {
      const startFrame = Math.floor(
        random(`${randomSeed}-start-${i}`) * Math.max(durationInFrames - fragmentFlashFrames, 1),
      );
      const xPercent = 10 + random(`${randomSeed}-x-${i}`) * 80;
      const yPercent = 10 + random(`${randomSeed}-y-${i}`) * 80;
      return { word, startFrame, xPercent, yPercent };
    });
  }, [wordFragments, randomSeed, durationInFrames, fragmentFlashFrames]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize,
          letterSpacing,
          color: textColor,
        }}
      >
        {text.slice(0, charsRevealed)}
      </div>

      {fragments.map((f, i) => {
        const local = frame - f.startFrame;
        const opacity =
          local < 0 || local > fragmentFlashFrames
            ? 0
            : interpolate(
                local,
                [0, fragmentFlashFrames * 0.3, fragmentFlashFrames * 0.7, fragmentFlashFrames],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${f.yPercent}%`,
              left: `${f.xPercent}%`,
              fontFamily,
              fontSize: fragmentFontSize,
              color: fragmentColor as string,
              opacity,
            }}
          >
            {f.word}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

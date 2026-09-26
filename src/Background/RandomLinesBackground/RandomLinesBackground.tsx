import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RandomLinesSchemaType } from "./random-lines.schema";

interface ActiveLine {
  id: string;
  yPosition: number;
  startFrame: number;
  fadeInEnd: number;
  displayEnd: number;
  fadeOutEnd: number;
  seed: string;
}

/**
 * Generate active lines for the current frame
 * Each line is assigned based on spawn timing
 */
const generateActiveLines = (
  frame: number,
  lineCount: number,
  spawnIntervalFrames: number,
  displayDurationFrames: number,
  fadeInDuration: number,
  fadeOutDuration: number,
  randomSeed: string,
  displayAreaHeightPx: number,
  minLineSpacingPx: number,
  maxConcurrentLines: number,
  height: number
): ActiveLine[] => {
  const active: ActiveLine[] = [];

  // Calculate display area boundaries (centered vertically)
  const displayAreaTopPx = (height - displayAreaHeightPx) / 2;
  // Convert boundaries to percentage
  const displayAreaTopPercent = (displayAreaTopPx / height) * 100;
  const displayAreaHeightPercent = (displayAreaHeightPx / height) * 100;
  const minSpacingPercent = (minLineSpacingPx / height) * 100;

  let spawnFrame = 0;
  let lineIndex = 0;
  const usedYPositions: number[] = [];

  while (spawnFrame <= frame) {
    // Randomize spawn time within interval
    const offset = Math.floor(
      random(`${randomSeed}-offset-${lineIndex}`) * spawnIntervalFrames
    );
    const actualSpawnFrame = spawnFrame + offset;

    if (actualSpawnFrame <= frame) {
      const fadeInEnd = actualSpawnFrame + fadeInDuration;
      const displayEnd = actualSpawnFrame + displayDurationFrames;
      const fadeOutEnd = displayEnd + fadeOutDuration;

      // Generate Y position within display area with spacing constraint
      let yPosition: number | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (yPosition === null && attempts < maxAttempts) {
        const candidateY =
          displayAreaTopPercent +
          random(`${randomSeed}-y-${lineIndex}-${attempts}`) *
            displayAreaHeightPercent;

        // Check spacing constraint
        const validSpacing = usedYPositions.every(
          (usedY) => Math.abs(candidateY - usedY) >= minSpacingPercent
        );

        if (validSpacing) {
          yPosition = candidateY;
        }

        attempts++;
      }

      // Include fade-out duration in active check and check max concurrent limit
      if (
        yPosition !== null &&
        actualSpawnFrame <= frame &&
        fadeOutEnd > frame &&
        active.length < maxConcurrentLines
      ) {
        active.push({
          id: `line-${lineIndex}`,
          yPosition,
          startFrame: actualSpawnFrame,
          fadeInEnd,
          displayEnd,
          fadeOutEnd,
          seed: `${randomSeed}-line-${lineIndex}`,
        });
        usedYPositions.push(yPosition);
      }

      lineIndex++;
      spawnFrame = actualSpawnFrame + 1;
    } else {
      break;
    }
  }

  return active;
};

/**
 * Single line renderer
 */
const RandomLine: React.FC<{
  line: ActiveLine;
  frame: number;
  lineHeight: number;
  lineColor: string;
  lineOpacity: number;
  fadeInDuration: number;
  fadeOutDuration: number;
}> = ({
  line,
  frame,
  lineHeight,
  lineColor,
  lineOpacity,
  fadeInDuration,
  fadeOutDuration,
}) => {
  const fadeInFrame = frame - line.startFrame;
  const fadeOutFrame = frame - line.displayEnd;

  // Calculate opacity with fade in/out
  const opacity = useMemo(() => {
    if (fadeInFrame < 0) {
      return 0;
    }
    if (fadeInFrame < fadeInDuration) {
      return interpolate(fadeInFrame, [0, fadeInDuration], [0, lineOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });
    }
    if (fadeOutFrame < 0) {
      return lineOpacity;
    }
    return interpolate(
      fadeOutFrame,
      [0, fadeOutDuration],
      [lineOpacity, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      }
    );
  }, [fadeInFrame, fadeOutFrame, fadeInDuration, fadeOutDuration, lineOpacity]);

  if (opacity <= 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: `${line.yPosition}%`,
        left: 0,
        width: "100%",
        height: `${lineHeight}px`,
        backgroundColor: lineColor,
        opacity,
      }}
    />
  );
};

export const RandomLinesBackground: React.FC<RandomLinesSchemaType> = ({
  lineCount,
  lineHeight,
  spawnIntervalFrames,
  displayDurationFrames,
  fadeInDuration,
  fadeOutDuration,
  lineColor,
  backgroundColor,
  lineOpacity,
  displayAreaHeightPx,
  minLineSpacingPx,
  maxConcurrentLines,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const activeLines = useMemo(
    () =>
      generateActiveLines(
        frame,
        lineCount,
        spawnIntervalFrames,
        displayDurationFrames,
        fadeInDuration,
        fadeOutDuration,
        randomSeed,
        displayAreaHeightPx,
        minLineSpacingPx,
        maxConcurrentLines,
        height
      ),
    [
      frame,
      lineCount,
      spawnIntervalFrames,
      displayDurationFrames,
      fadeInDuration,
      fadeOutDuration,
      randomSeed,
      displayAreaHeightPx,
      minLineSpacingPx,
      maxConcurrentLines,
      height,
    ]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        overflow: "hidden",
      }}
    >
      {activeLines.map((line) => (
        <RandomLine
          key={line.id}
          line={line}
          frame={frame}
          lineHeight={lineHeight}
          lineColor={lineColor}
          lineOpacity={lineOpacity}
          fadeInDuration={fadeInDuration}
          fadeOutDuration={fadeOutDuration}
        />
      ))}
    </AbsoluteFill>
  );
};

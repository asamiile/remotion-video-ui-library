import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GlitchTextRandomSchemaType } from "./glitch-text-random.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const GARBLE_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-#@*$%▯∞";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const estimateTextWidth = (
  text: string,
  fontSize: number,
  letterSpacing: string
): number => {
  const spacingValue = Number.parseFloat(letterSpacing) || 0;
  const spacingPx = letterSpacing.endsWith("em")
    ? spacingValue * fontSize
    : spacingValue;
  const glyphWidth = Array.from(text).reduce(
    (width, character) =>
      width +
      ((character.codePointAt(0) ?? 0) <= 0xff ? fontSize * 0.62 : fontSize),
    0
  );

  return glyphWidth + Math.max(0, Array.from(text).length - 1) * spacingPx;
};

function garbleChars(text: string, seed: string, rate: number): string {
  return Array.from(text)
    .map((ch, i) => {
      if (/\s/.test(ch)) {
        return ch;
      }
      if (random(`${seed}-gr-${i}`) < rate) {
        return GARBLE_POOL[
          Math.floor(random(`${seed}-gp-${i}`) * GARBLE_POOL.length)
        ];
      }
      return ch;
    })
    .join("");
}

interface ActiveItem {
  text: string;
  startFrame: number;
  glitchStartFrame: number;
  fadeOutStartFrame: number;
  x: number;
  y: number;
  seed: string;
}

/**
 * 4x2 grid of cells for random placement on a square canvas
 * Each item appears in a random cell within the grid
 * 8 items in 8 cells = one item per cell
 */
const GRID_COLS = 2;
const GRID_ROWS = 4;

/**
 * Get random position within a grid cell
 */
const getPositionInGridCell = (
  cellCol: number,
  cellRow: number,
  randomSeed: string,
  randIndex: number
): { x: number; y: number } => {
  const cellWidth = 100 / GRID_COLS;
  const cellHeight = 100 / GRID_ROWS;
  const cellCenterX = (cellCol + 0.5) * cellWidth;
  const cellCenterY = (cellRow + 0.5) * cellHeight;
  const jitterRatio = 0.18;
  const x =
    cellCenterX +
    (random(`${randomSeed}-cx-${randIndex}`) - 0.5) *
      cellWidth *
      jitterRatio;
  const y =
    cellCenterY +
    (random(`${randomSeed}-cy-${randIndex}`) - 0.5) *
      cellHeight *
      jitterRatio;

  return { x, y };
};

/**
 * Generates random items to display at random positions in grid cells
 * Each item is assigned to a unique cell based on its index, ensuring no overlap
 */
const generateActiveItems = (
  frame: number,
  items: Array<{ text: string }>,
  spawnIntervalFrames: number,
  glitchDelayFrames: number,
  displayDurationFrames: number,
  fadeOutDuration: number,
  initialDelayFrames: number,
  randomSeed: string
): ActiveItem[] => {
  const active: ActiveItem[] = [];

  if (!items || items.length === 0) {
    return active;
  }

  const totalCells = GRID_COLS * GRID_ROWS;

  // For each possible spawn time, decide if we spawn an item
  let spawnFrame = initialDelayFrames;
  let itemIndex = 0;

  while (spawnFrame <= frame) {
    // Use random to decide actual spawn time relative to spawnFrame
    const offset =
      itemIndex === 0
        ? 0
        : Math.floor(
            random(`${randomSeed}-offset-${itemIndex}`) * spawnIntervalFrames
          );
    const actualSpawnFrame = spawnFrame + offset;

    if (actualSpawnFrame <= frame) {
      const item = items[itemIndex % items.length];
      const glitchStart = actualSpawnFrame + glitchDelayFrames;
      const fadeOutStart = actualSpawnFrame + displayDurationFrames;
      const fadeOutEnd = fadeOutStart + fadeOutDuration;

      // Assign grid cell based on itemIndex to ensure each visible item gets a unique cell
      // This prevents overlap: items cycle through cells after earlier items fade out.
      const cellIndex = itemIndex % totalCells;
      const cellCol = cellIndex % GRID_COLS;
      const cellRow = Math.floor(cellIndex / GRID_COLS);

      const { x, y } = getPositionInGridCell(
        cellCol,
        cellRow,
        randomSeed,
        itemIndex
      );

      // Include fade-out duration in the active check to keep the item visible through fade-out
      if (actualSpawnFrame <= frame && fadeOutEnd > frame) {
        active.push({
          text: item.text,
          startFrame: actualSpawnFrame,
          glitchStartFrame: glitchStart,
          fadeOutStartFrame: fadeOutStart,
          x,
          y,
          seed: `${randomSeed}-item-${itemIndex}`,
        });
      }

      itemIndex++;
      spawnFrame = actualSpawnFrame + 1;
    } else {
      break;
    }
  }

  return active;
};

/**
 * Single item renderer
 */
const GlitchItem: React.FC<{
  item: ActiveItem;
  frame: number;
  fontFamily: string;
  fontSize: number;
  letterSpacing: string;
  rgbOffsetMax: number;
  strongGlitchProbability: number;
  glitchSegmentFrames: number;
  garbleRate: number;
  jitterPx: number;
  textColor: string;
  channelRColor: string;
  channelBColor: string;
  fadeOutDuration: number;
  scanlineOpacity: number;
  compositionWidth: number;
  compositionHeight: number;
}> = ({
  item,
  frame,
  fontFamily,
  fontSize,
  letterSpacing,
  rgbOffsetMax,
  strongGlitchProbability,
  glitchSegmentFrames,
  garbleRate,
  jitterPx,
  textColor,
  channelRColor,
  channelBColor,
  fadeOutDuration,
  scanlineOpacity,
  compositionWidth,
  compositionHeight,
}) => {
  const activeFrame = frame - item.startFrame;
  const glitchActiveFrame = Math.max(0, frame - item.glitchStartFrame);
  const fadeOutFrame = frame - item.fadeOutStartFrame;

  // Fade out opacity
  const fadeOutOpacity = useMemo(() => {
    if (fadeOutFrame < 0) {
      return 1;
    }
    return interpolate(fadeOutFrame, [0, fadeOutDuration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [fadeOutFrame, fadeOutDuration]);

  // Glitch effect (only after glitch delay)
  const { displayText, offR, offB, rgbBoost, burstY } = useMemo(() => {
    const seg =
      glitchActiveFrame >= 0 ? Math.floor(glitchActiveFrame / glitchSegmentFrames) : 0;
    const burst =
      glitchActiveFrame >= 0 &&
      random(`${item.seed}-burst-${seg}`) < strongGlitchProbability;
    const boost = burst ? 1.55 : 1;
    const disp =
      burst && glitchActiveFrame >= 0
        ? garbleChars(item.text, `${item.seed}-b-${seg}`, garbleRate)
        : item.text;

    const offRx = Math.round(
      (random(`${item.seed}-rx-${seg}`) - 0.5) * 2 * rgbOffsetMax * boost
    );
    const offBx = Math.round(
      (random(`${item.seed}-bx-${seg}`) - 0.5) * 2 * rgbOffsetMax * boost
    );
    const by = burst ? Math.round((random(`${item.seed}-by-${seg}`) - 0.5) * 4) : 0;

    return {
      displayText: disp,
      offR: offRx,
      offB: offBx,
      rgbBoost: boost,
      burstY: by,
    };
  }, [glitchActiveFrame, item.text, item.seed, rgbOffsetMax, strongGlitchProbability, glitchSegmentFrames, garbleRate]);

  const jitterX = useMemo(() => {
    if (activeFrame < 0 || jitterPx <= 0) {
      return 0;
    }
    return Math.round(
      (random(`${item.seed}-jx-${frame}`) - 0.5) * 2 * jitterPx
    );
  }, [activeFrame, frame, jitterPx, item.seed]);

  const jitterY = useMemo(() => {
    if (activeFrame < 0 || jitterPx <= 0) {
      return 0;
    }
    return Math.round(
      (random(`${item.seed}-jy-${frame}`) - 0.5) * 2 * jitterPx
    );
  }, [activeFrame, frame, jitterPx, item.seed]);

  const textBlockStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: "400",
    fontSize,
    letterSpacing,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };

  const effectMargin = rgbOffsetMax * 1.55 + jitterPx + 4;
  const halfTextWidth =
    estimateTextWidth(item.text, fontSize, letterSpacing) / 2 + effectMargin;
  const halfTextHeight = (fontSize * 1.2) / 2 + jitterPx + 4;
  const safeX = clamp(
    (item.x / 100) * compositionWidth,
    halfTextWidth,
    Math.max(halfTextWidth, compositionWidth - halfTextWidth)
  );
  const safeY = clamp(
    (item.y / 100) * compositionHeight,
    halfTextHeight,
    Math.max(halfTextHeight, compositionHeight - halfTextHeight)
  );

  if (fadeOutOpacity <= 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: safeX,
        top: safeY,
        opacity: fadeOutOpacity,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          transform: `translate(${jitterX}px, ${jitterY + burstY}px)`,
        }}
      >
        <p
          style={{
            ...textBlockStyle,
            position: "absolute",
            left: offR,
            top: 0,
            color: channelRColor as string,
            opacity: 0.85,
            zIndex: 0,
          }}
        >
          {displayText}
        </p>
        <p
          style={{
            ...textBlockStyle,
            position: "absolute",
            left: offB,
            top: 0,
            color: channelBColor as string,
            opacity: 0.85,
            zIndex: 0,
          }}
        >
          {displayText}
        </p>
        <p
          style={{
            ...textBlockStyle,
            position: "relative",
            color: textColor,
            zIndex: 1,
            textShadow:
              rgbBoost > 1.2 ? `0 0 12px ${textColor}44, 0 0 2px rgba(0,0,0,0.8)` : "none",
          }}
        >
          {displayText}
        </p>
      </div>

      {scanlineOpacity > 0.01 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: scanlineOpacity,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 3px)",
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
};

export const GlitchTextRandomTemplate: React.FC<GlitchTextRandomSchemaType> = ({
  items,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  channelRColor,
  channelBColor,
  rgbOffsetMax,
  strongGlitchProbability,
  glitchSegmentFrames,
  garbleRate,
  jitterPx,
  scanlineOpacity,
  backgroundColor,
  spawnIntervalFrames,
  glitchDelayFrames,
  displayDurationFrames,
  fadeOutDuration,
  initialDelayFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const activeItems = useMemo(
    () =>
      generateActiveItems(
        frame,
        items,
        spawnIntervalFrames,
        glitchDelayFrames,
        displayDurationFrames,
        fadeOutDuration,
        initialDelayFrames,
        randomSeed
      ),
    [frame, items, spawnIntervalFrames, glitchDelayFrames, displayDurationFrames, fadeOutDuration, initialDelayFrames, randomSeed]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        overflow: "hidden",
      }}
    >
      {activeItems.map((item, idx) => (
        <GlitchItem
          key={idx}
          item={item}
          frame={frame}
          fontFamily={fontFamily}
          fontSize={fontSize}
          letterSpacing={letterSpacing}
          rgbOffsetMax={rgbOffsetMax}
          strongGlitchProbability={strongGlitchProbability}
          glitchSegmentFrames={glitchSegmentFrames}
          garbleRate={garbleRate}
          jitterPx={jitterPx}
          textColor={textColor}
          channelRColor={channelRColor}
          channelBColor={channelBColor}
          fadeOutDuration={fadeOutDuration}
          scanlineOpacity={scanlineOpacity}
          compositionWidth={width}
          compositionHeight={height}
        />
      ))}

      {scanlineOpacity > 0.01 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: scanlineOpacity * 0.5,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 3px)",
            mixBlendMode: "overlay",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

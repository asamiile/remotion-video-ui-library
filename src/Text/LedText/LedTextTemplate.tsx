import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { LedTextSchemaType } from "./led-text.schema";
import { rasterizeTextToGrid } from "./rasterize-text-to-grid";

type LedDotMatrixBlockProps = {
  grid: boolean[][];
  cellSize: number;
  dotDiameter: number;
  onColor: string;
  offColor: string;
  coreColor?: string;
  maxColumnExclusive: number;
  flickerMul: number;
};

const LedDotMatrixBlock: React.FC<LedDotMatrixBlockProps> = ({
  grid,
  cellSize,
  dotDiameter,
  onColor,
  offColor,
  coreColor,
  maxColumnExclusive,
  flickerMul,
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const limitCol = Math.max(0, Math.min(cols, maxColumnExclusive));
  const dots: React.ReactNode[] = [];
  const radius = dotDiameter / 2;

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < limitCol; gx++) {
      const on = grid[gy][gx];
      const fill = on
        ? coreColor
          ? `radial-gradient(circle at 35% 32%, ${coreColor} 0%, ${onColor} 55%, ${onColor} 100%)`
          : onColor
        : offColor;

      dots.push(
        <div
          key={`${gx}-${gy}`}
          style={{
            position: "absolute",
            left: gx * cellSize,
            top: gy * cellSize,
            width: cellSize,
            height: cellSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: on ? flickerMul : 1,
          }}
        >
          <div
            style={{
              width: dotDiameter,
              height: dotDiameter,
              borderRadius: radius,
              background: fill,
            }}
          />
        </div>,
      );
    }
  }

  const width = limitCol * cellSize;
  const height = rows * cellSize;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        flexShrink: 0,
      }}
    >
      {dots}
    </div>
  );
};

/** Fills the gap between the two tiled scroll copies with off-LED columns so the panel doesn't visibly break */
const LedScrollGapStrip: React.FC<{
  columns: number;
  rows: number;
  cellSize: number;
  dotDiameter: number;
  offColor: string;
}> = ({ columns, rows, cellSize, dotDiameter, offColor }) => {
  if (columns <= 0 || rows <= 0) {
    return null;
  }
  const dots: React.ReactNode[] = [];
  const radius = dotDiameter / 2;
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < columns; gx++) {
      dots.push(
        <div
          key={`g-${gx}-${gy}`}
          style={{
            position: "absolute",
            left: gx * cellSize,
            top: gy * cellSize,
            width: cellSize,
            height: cellSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: dotDiameter,
              height: dotDiameter,
              borderRadius: radius,
              background: offColor,
            }}
          />
        </div>,
      );
    }
  }
  return (
    <div
      style={{
        position: "relative",
        width: columns * cellSize,
        height: rows * cellSize,
        flexShrink: 0,
      }}
    >
      {dots}
    </div>
  );
};

export const LedTextTemplate: React.FC<LedTextSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    cellSize,
    sampleThreshold,
    paddingCells,
    onColor,
    offColor,
    coreColor,
    dotRadiusRatio,
    glowEnabled,
    glowBlur,
    glowOpacity,
    glowSpreadRatio,
    animationMode,
    typewriterFramesPerColumn,
    scrollPixelsPerFrame,
    scrollGapCells,
    flickerStrength,
    randomSeed,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
    panelBackground,
    panelPadding,
    panelBorderRadius,
    scanlinesOpacity,
  } = props;

  const grid = useMemo(
    () =>
      rasterizeTextToGrid({
        text,
        fontFamily,
        fontWeight,
        fontSize,
        cellSize,
        sampleThreshold,
        paddingCells,
      }),
    [text, fontFamily, fontWeight, fontSize, cellSize, sampleThreshold, paddingCells],
  );

  const cols = grid[0]?.length ?? 1;
  const rows = grid.length;
  const dotDiameter = cellSize * (dotRadiusRatio * 2);

  const activeFrame = frame - delayFrames;
  const fadeIn = useMemo(() => {
    if (activeFrame <= 0) {
      return 0;
    }
    if (fadeInDuration <= 0) {
      return 1;
    }
    return interpolate(activeFrame, [0, fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }, [activeFrame, fadeInDuration]);

  const flickerMul = useMemo(() => {
    if (flickerStrength <= 0) {
      return 1;
    }
    const j = random(`${randomSeed}-f-${frame}`);
    return 1 - flickerStrength * j;
  }, [flickerStrength, randomSeed, frame]);

  let maxColumnExclusive = cols;
  if (animationMode === "typewriter") {
    if (activeFrame < 0) {
      maxColumnExclusive = 0;
    } else {
      const revealed = Math.floor(activeFrame / typewriterFramesPerColumn) + 1;
      maxColumnExclusive = Math.max(0, Math.min(cols, revealed));
    }
  }

  const blockWidth = cols * cellSize;
  const blockHeight = rows * cellSize;
  const gapPx = scrollGapCells * cellSize;

  let scrollOffset = 0;
  if (animationMode === "scroll" && activeFrame >= 0) {
    const segment = blockWidth + gapPx;
    if (segment > 0) {
      scrollOffset = (activeFrame * scrollPixelsPerFrame) % segment;
    }
  }

  const matrixPropsCommon = {
    grid,
    cellSize,
    dotDiameter,
    onColor,
    offColor,
    coreColor,
    flickerMul,
  };

  const renderMatrix = () =>
    animationMode === "scroll" ? (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          transform: `translateX(${-scrollOffset}px)`,
        }}
      >
        <LedDotMatrixBlock
          {...matrixPropsCommon}
          maxColumnExclusive={cols}
        />
        <LedScrollGapStrip
          columns={scrollGapCells}
          rows={rows}
          cellSize={cellSize}
          dotDiameter={dotDiameter}
          offColor={offColor}
        />
        <LedDotMatrixBlock
          {...matrixPropsCommon}
          maxColumnExclusive={cols}
        />
      </div>
    ) : (
      <LedDotMatrixBlock
        {...matrixPropsCommon}
        maxColumnExclusive={maxColumnExclusive}
      />
    );

  const clipWidth =
    animationMode === "scroll"
      ? Math.min(blockWidth, 920)
      : Math.max(maxColumnExclusive * cellSize, cellSize);

  const clipStyle: React.CSSProperties =
    animationMode === "scroll"
      ? {
          width: clipWidth,
          maxWidth: "100%",
          overflow: "hidden",
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
          height: blockHeight,
        }
      : {
          position: "relative",
          width: clipWidth,
          height: blockHeight,
        };

  const panelStyle: React.CSSProperties = {
    position: "absolute",
    left: `${paddingLeftPercent}%`,
    bottom: `${paddingBottomPercent}%`,
    backgroundColor: panelBackground,
    padding: panelPadding,
    borderRadius: panelBorderRadius,
    boxSizing: "border-box",
    opacity: fadeIn,
    maxWidth: `${100 - paddingLeftPercent - 2}%`,
  };

  const showGlow = glowEnabled && glowBlur > 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={panelStyle}>
        <div style={{ position: "relative" }}>
          <div style={clipStyle}>
            {showGlow ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    filter: `blur(${glowBlur}px)`,
                    opacity: glowOpacity,
                    transform: `scale(${glowSpreadRatio})`,
                    transformOrigin: "0 0",
                  }}
                >
                  {renderMatrix()}
                </div>
              </div>
            ) : null}
            <div style={{ position: "relative", zIndex: 1 }}>{renderMatrix()}</div>
          </div>

          {scanlinesOpacity > 0 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
                opacity: scanlinesOpacity,
                borderRadius: panelBorderRadius,
              }}
            />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

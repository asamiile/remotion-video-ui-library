import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";
import { NEON_FLICKER_CYCLE_MS, neonFlickerAt } from "../../helpers/neon-flicker";
import type {
  CodeStreamLineV1Type,
  CodeStreamSchemaType,
} from "./code-stream.schema";

export type CodeStreamTemplateV1Props = CodeStreamSchemaType;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function resolveLine(line: CodeStreamLineV1Type): { text: string; color?: string } {
  if (typeof line === "string") {
    return { text: line };
  }

  return {
    text: line.text,
    color: line.color,
  };
}

function CodeLine({
  text,
  color,
  shadow,
  fontSize,
  lineHeight,
  letterSpacing,
  opacity,
  brightness,
}: {
  text: string;
  color: string;
  shadow: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  opacity: number;
  brightness: number;
}) {
  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        fontFamily: JETBRAINS_MONO_FONT_FAMILY,
        fontSize,
        lineHeight: `${lineHeight}px`,
        letterSpacing,
        color,
        textShadow: shadow,
        opacity,
        filter: `brightness(${brightness})`,
        flexShrink: 0,
      }}
    >
      {text}
    </div>
  );
}

export const CodeStreamTemplateV1: React.FC<CodeStreamTemplateV1Props> = ({
  direction,
  paragraphs,
  lines,
  speedPxPerFrame,
  gapPx,
  textSize,
  lineHeight,
  letterSpacing,
  panelPaddingPx,
  backgroundColor,
  primaryColor,
  flickerProbability,
  flickerWindowMs,
  endPaddingFrames,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const paragraphSource: ReadonlyArray<ReadonlyArray<CodeStreamLineV1Type>> = useMemo(() => {
    if (paragraphs && paragraphs.length > 0) {
      return paragraphs;
    }
    if (lines && lines.length > 0) {
      return [lines];
    }
    return [[""]];
  }, [lines, paragraphs]);

  const panelWidthPx = Math.max(0, width - panelPaddingPx * 2);
  const verticalLineGapPx = Math.round(lineHeight * 0.4);
  const paragraphLayouts: Array<{
    paragraphLines: ReadonlyArray<CodeStreamLineV1Type>;
    panelHeightPx: number;
    cycleDistance: number;
  }> = useMemo(() => {
    return paragraphSource.map((paragraphLines) => {
      const panelHeightPx =
        direction === "horizontal"
          ? Math.max(0, height - panelPaddingPx * 2)
          : panelPaddingPx * 2 +
            paragraphLines.length * lineHeight +
            Math.max(0, paragraphLines.length - 1) * verticalLineGapPx +
            24;
      const cycleDistance =
        (direction === "horizontal" ? width : height) +
        (direction === "horizontal" ? panelWidthPx : panelHeightPx) +
        gapPx;

      return {
        paragraphLines,
        panelHeightPx,
        cycleDistance,
      };
    });
  }, [
    paragraphSource,
    direction,
    gapPx,
    height,
    lineHeight,
    panelPaddingPx,
    panelWidthPx,
    verticalLineGapPx,
    width,
  ]);

  const totalCycleDistance = paragraphLayouts.reduce(
    (total, layout) => total + layout.cycleDistance,
    0,
  );
  const endPaddingPx = endPaddingFrames * speedPxPerFrame;
  const totalScrollDistance = totalCycleDistance + endPaddingPx;
  const rawMotionPx = frame * speedPxPerFrame;
  const motionPx = Math.min(rawMotionPx, totalScrollDistance);

  let activeParagraphIndex = 0;
  let activeParagraphOffset = motionPx;
  let accumulatedDistance = 0;

  // If motion has exceeded the cycle distance, stay at the end
  if (motionPx >= totalCycleDistance) {
    activeParagraphIndex = paragraphLayouts.length > 0 ? paragraphLayouts.length - 1 : 0;
    activeParagraphOffset = totalCycleDistance;
  } else {
    for (let index = 0; index < paragraphLayouts.length; index += 1) {
      const layout = paragraphLayouts[index];
      if (motionPx < accumulatedDistance + layout.cycleDistance) {
        activeParagraphIndex = index;
        activeParagraphOffset = motionPx - accumulatedDistance;
        break;
      }
      accumulatedDistance += layout.cycleDistance;
    }
  }

  const activeLayout = paragraphLayouts[activeParagraphIndex] ?? paragraphLayouts[0];
  const nextParagraphIndex =
    paragraphLayouts.length > 0
      ? (activeParagraphIndex + 1) % paragraphLayouts.length
      : 0;
  const nextLayout = paragraphLayouts[nextParagraphIndex] ?? activeLayout;
  const viewportSpan = direction === "horizontal" ? width : height;
  const startOutside = viewportSpan + gapPx;
  const offset = startOutside - activeParagraphOffset;
  const nextOffset =
    offset + activeLayout.cycleDistance;
  const hasNextParagraph = paragraphLayouts.length > 1;
  const activePanelSpan =
    direction === "horizontal" ? panelWidthPx : activeLayout.panelHeightPx;
  const activeTrailingEdge = offset + activePanelSpan;
  const nextRevealStartPx = 120;
  const shouldRenderNext =
    hasNextParagraph && activeTrailingEdge <= nextRevealStartPx;

  const buildContent = (
    paragraphLines: ReadonlyArray<CodeStreamLineV1Type>,
    panelKey: string,
  ) =>
    paragraphLines.map((line, index) => {
      const resolvedLine = resolveLine(line);
      const color = resolvedLine.color ?? primaryColor;
      const shadow = `0 0 4px ${color}, 0 0 12px ${color}80`;

      const lineSeed = hashString(`${panelKey}-${index}-${resolvedLine.text}`);
      const windowIndex = Math.floor((frame / fps) * 1000 / flickerWindowMs);
      const windowSeed = hashString(`${lineSeed}-${windowIndex}`);
      const shouldFlicker = (windowSeed / 0xffffffff) < flickerProbability;
      const elapsedSinceFlickerMs = shouldFlicker
        ? (((frame / fps) * 1000 + (lineSeed % NEON_FLICKER_CYCLE_MS)) %
            NEON_FLICKER_CYCLE_MS)
        : -1;
      const flicker = neonFlickerAt(elapsedSinceFlickerMs);

      return (
        <CodeLine
          key={`${panelKey}-${index}-${resolvedLine.text}`}
          text={resolvedLine.text}
          color={color}
          shadow={shadow}
          fontSize={textSize}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          opacity={flicker.opacity}
          brightness={flicker.brightness}
        />
      );
    });

  const content = buildContent(activeLayout.paragraphLines, "active");
  const nextContent = buildContent(nextLayout.paragraphLines, "next");

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: panelPaddingPx,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: direction === "horizontal" ? "row" : "column",
            alignItems: direction === "horizontal" ? "flex-start" : "stretch",
            justifyContent: "flex-start",
            width:
              direction === "horizontal"
                ? panelWidthPx * 2 + gapPx
                : panelWidthPx,
            height:
              direction === "vertical"
                ? activeLayout.panelHeightPx + gapPx
                : activeLayout.panelHeightPx,
            gap: `${gapPx}px`,
          }}
        >
          {[
            {
              key: "active-panel",
              panelOffset: offset,
              panelHeightPx: activeLayout.panelHeightPx,
              panelContent: content,
            },
            ...(shouldRenderNext
              ? [
                  {
                    key: "next-panel",
                    panelOffset: nextOffset,
                    panelHeightPx: nextLayout.panelHeightPx,
                    panelContent: nextContent,
                  },
                ]
              : []),
          ].map((panel) => (
            <div
              key={panel.key}
              style={{
                position: "absolute",
                left: direction === "horizontal" ? panel.panelOffset : panelPaddingPx,
                top: direction === "horizontal" ? panelPaddingPx : panel.panelOffset,
                display: "flex",
                flexDirection: "column",
                gap: direction === "horizontal" ? Math.round(lineHeight * 0.35) : verticalLineGapPx,
                paddingTop: direction === "horizontal" ? 24 : 12,
                paddingBottom: direction === "horizontal" ? 24 : 12,
                paddingLeft: 16,
                paddingRight: 16,
                width: panelWidthPx,
                height: panel.panelHeightPx,
                boxSizing: "border-box",
                minWidth: 0,
                minHeight: 0,
              }}
            >
              {panel.panelContent}
            </div>
          ))}
        </div>
      </div>
      {/* <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.34))",
          pointerEvents: "none",
        }}
      /> */}
    </AbsoluteFill>
  );
};

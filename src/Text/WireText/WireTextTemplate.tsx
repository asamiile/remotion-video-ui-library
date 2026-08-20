import React, { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WireTextSchemaType } from "./wire-text.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const VB_W = 1600;
/** Same as GlitchText: starts from the left edge of the string inside the bottom-left container */
const TX = 0;

function estimateDashLength(
  lines: string[],
  fontSize: number,
  lineHeight: number,
): number {
  let sum = 0;
  for (const line of lines) {
    const n = Math.max(line.length, 1);
    sum += n * fontSize * 2.6 + fontSize * 4;
  }
  if (lines.length > 1) {
    sum += (lines.length - 1) * fontSize * (lineHeight - 1) * 3;
  }
  return Math.max(sum, 480);
}

function pickDrawEasing(mode: WireTextSchemaType["drawEasing"]) {
  if (mode === "linear") {
    return Easing.linear;
  }
  if (mode === "easeInOut") {
    return Easing.inOut(Easing.cubic);
  }
  return Easing.out(Easing.cubic);
}

export const WireTextTemplate: React.FC<WireTextSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const { width: compositionWidth } = useVideoConfig();
  const filterId = useId().replace(/:/g, "");
  const strokeTextRef = useRef<SVGTextElement>(null);

  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    wireColor,
    strokeWidth,
    wireGlowBlur,
    fillEnabled,
    fillColor,
    fillFadeInFrames,
    fillDelayAfterDrawFrames,
    drawDurationFrames,
    drawEasing,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
    backgroundColor,
  } = props;

  /**
   * GlitchText uses CSS fontSize (1:1 with composition px). Here we're in SVG
   * viewBox user units, so the font size is corrected in user-space
   * coordinates so the rendered output matches props.fontSize in pixels.
   */
  const captionInnerWidthPx =
    compositionWidth * ((100 - paddingLeftPercent - 2) / 100);
  const svgFontSize =
    (fontSize * VB_W) / Math.max(1, captionInnerWidthPx);

  const [dashTotal, setDashTotal] = useState(() =>
    estimateDashLength(
      text.split("\n"),
      (fontSize * VB_W) /
        Math.max(
          1,
          compositionWidth * ((100 - paddingLeftPercent - 2) / 100),
        ),
      lineHeight,
    ),
  );

  const lines = useMemo(() => text.split("\n"), [text]);
  const lineGapPx = svgFontSize * lineHeight;
  const startDy = -((lines.length - 1) / 2) * lineGapPx;

  /**
   * The viewBox height is fit to the text plus its stroke and glow (same
   * idea as NeonTextRainbow). A fixed value like 420 tends to produce
   * unnatural vertical padding/scale under `meet`.
   */
  const { vbH, cy } = useMemo(() => {
    const lineCount = Math.max(1, lines.length);
    const lineBlock = lineCount * svgFontSize * lineHeight;
    const pad =
      strokeWidth + Math.min(36, 2.4 * wireGlowBlur);
    const h = Math.ceil(lineBlock + pad);
    const clamped = Math.min(520, Math.max(56, h));
    return { vbH: clamped, cy: clamped / 2 };
  }, [lines.length, svgFontSize, lineHeight, strokeWidth, wireGlowBlur]);

  const buildTspans = (keyPrefix: string) =>
    lines.map((line, i) => (
      <tspan key={`${keyPrefix}-${i}`} x={TX} dy={i === 0 ? startDy : lineGapPx}>
        {line}
      </tspan>
    ));

  useLayoutEffect(() => {
    const el = strokeTextRef.current;
    if (!el) {
      return;
    }
    try {
      const box = el.getBBox();
      const len = el.getComputedTextLength();
      const w = box.width;
      const h = box.height;
      const combined = Math.max(
        w * 2.9 + h * 3.2,
        len * 2.6,
        estimateDashLength(lines, svgFontSize, lineHeight),
      );
      setDashTotal(Math.ceil(combined));
    } catch {
      setDashTotal(estimateDashLength(lines, svgFontSize, lineHeight));
    }
  }, [
    text,
    svgFontSize,
    fontFamily,
    fontWeight,
    letterSpacing,
    lineHeight,
    lines,
  ]);

  const activeFrame = frame - delayFrames;

  const mountFade = useMemo(() => {
    if (activeFrame <= 0) {
      return 0;
    }
    if (fadeInDuration <= 0) {
      return 1;
    }
    return interpolate(activeFrame, [0, fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInDuration]);

  const drawProgress = useMemo(() => {
    if (activeFrame < 0 || drawDurationFrames <= 0) {
      return activeFrame < 0 ? 0 : 1;
    }
    return interpolate(activeFrame, [0, drawDurationFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: pickDrawEasing(drawEasing),
    });
  }, [activeFrame, drawDurationFrames, drawEasing]);

  const strokeDashoffset = interpolate(drawProgress, [0, 1], [dashTotal, 0]);

  const fillStartsAt = drawDurationFrames + fillDelayAfterDrawFrames;
  const fillProgress = useMemo(() => {
    if (fillFadeInFrames <= 0) {
      return activeFrame >= fillStartsAt ? 1 : 0;
    }
    if (activeFrame < fillStartsAt) {
      return 0;
    }
    return interpolate(
      activeFrame,
      [fillStartsAt, fillStartsAt + fillFadeInFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  }, [activeFrame, fillStartsAt, fillFadeInFrames]);

  const textCommon: React.SVGTextElementAttributes<SVGTextElement> = {
    x: TX,
    y: cy,
    textAnchor: "start",
    dominantBaseline: "middle",
    style: {
      fontFamily,
      fontWeight: fontWeight as string,
      fontSize: svgFontSize,
      letterSpacing,
    },
  };

  const showGlow = wireGlowBlur > 0;

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}>
      <div
        style={{
          position: "absolute",
          left: `${paddingLeftPercent}%`,
          bottom: `${paddingBottomPercent}%`,
          opacity: mountFade,
          width: `${100 - paddingLeftPercent - 2}%`,
          maxWidth: `${100 - paddingLeftPercent - 2}%`,
        }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${vbH}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            height: "auto",
            overflow: "visible",
          }}
        >
          {showGlow ? (
            <defs>
              <filter
                id={filterId}
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={wireGlowBlur}
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          ) : null}

          {fillEnabled ? (
            <text {...textCommon} fill={fillColor} stroke="none" opacity={fillProgress}>
              {buildTspans("fill")}
            </text>
          ) : null}

          <text
            ref={strokeTextRef}
            {...textCommon}
            fill="none"
            stroke={wireColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashTotal}
            strokeDashoffset={strokeDashoffset}
            filter={showGlow ? `url(#${filterId})` : undefined}
          >
            {buildTspans("stroke")}
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

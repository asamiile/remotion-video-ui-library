import React, { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { WireTextSchemaV1Type } from "./wire-text-schema";
import "../../helpers/line-seed-jp";

const VB_W = 1600;
const VB_H = 420;
const CX = VB_W / 2;
const CY = VB_H / 2;

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

function pickDrawEasing(mode: WireTextSchemaV1Type["drawEasing"]) {
  if (mode === "linear") {
    return Easing.linear;
  }
  if (mode === "easeInOut") {
    return Easing.inOut(Easing.cubic);
  }
  return Easing.out(Easing.cubic);
}

export const WireTextTemplateV1: React.FC<WireTextSchemaV1Type> = (props) => {
  const frame = useCurrentFrame();
  const filterId = useId().replace(/:/g, "");
  const strokeTextRef = useRef<SVGTextElement>(null);
  const [dashTotal, setDashTotal] = useState(() =>
    estimateDashLength(
      props.text.split("\n"),
      props.fontSize,
      props.lineHeight,
    ),
  );

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
    positionX,
    positionY,
    backgroundColor,
  } = props;

  const lines = useMemo(() => text.split("\n"), [text]);
  const lineGapPx = fontSize * lineHeight;
  const startDy = -((lines.length - 1) / 2) * lineGapPx;

  const buildTspans = (keyPrefix: string) =>
    lines.map((line, i) => (
      <tspan key={`${keyPrefix}-${i}`} x={CX} dy={i === 0 ? startDy : lineGapPx}>
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
        estimateDashLength(lines, fontSize, lineHeight),
      );
      setDashTotal(Math.ceil(combined));
    } catch {
      setDashTotal(estimateDashLength(lines, fontSize, lineHeight));
    }
  }, [text, fontSize, fontFamily, fontWeight, letterSpacing, lineHeight, lines]);

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
    x: CX,
    y: CY,
    textAnchor: "middle",
    dominantBaseline: "middle",
    style: {
      fontFamily,
      fontWeight: fontWeight as string,
      fontSize,
      letterSpacing,
    },
  };

  const showGlow = wireGlowBlur > 0;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          position: "absolute",
          left: `${positionX}%`,
          top: `${positionY}%`,
          transform: "translate(-50%, -50%)",
          opacity: mountFade,
          maxWidth: "92vw",
        }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            display: "block",
            width: "min(1200px, 88vw)",
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

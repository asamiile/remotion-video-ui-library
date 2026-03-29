import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NeonTextRainbowSchemaV1Type } from "./neon-text-rainbow-schema";
import "../../helpers/jetbrains-mono";
import "../../helpers/line-seed-jp";

const VB_W = 1600;
const CX = VB_W / 2;
/** GlitchText と同様に左下コンテナ内で文字列の左端から始まる */
const TX = 0;

/** delay 後タイムライン上のストップ位置（rotate させる前のベース） */
const STOP_OFFSETS = [
  "0%",
  "16.66%",
  "33.33%",
  "50%",
  "66.66%",
  "83.33%",
  "100%",
] as const;

/**
 * 立ち上がり: 青・シアン・青みの強いティール（黄みの緑を抑え、緑帯にも青グラデを乗せる）
 */
const COOL_NEON = [
  "#00b8ff",
  "#0078e6",
  "#00a8d0",
  "#00b8b0",
  "#22d8c8",
  "#0098d8",
  "#00b8ff",
] as const;

/** 後半: 黄〜金〜オレンジ〜赤（マゼンタ比を抑える） */
const WARM_NEON = [
  "#fff400",
  "#ffdd18",
  "#ffcc00",
  "#ff7a00",
  "#ff2d2d",
  "#ff4400",
  "#fff400",
] as const;

/** colorShiftEnabled: false 時（従来のフル寄りストップ） */
const FULL_SPECTRUM_STOPS = [
  "#ff0080",
  "#ff8000",
  "#eeff00",
  "#00ffaa",
  "#0088ff",
  "#a000ff",
  "#ff0080",
] as const;

export const NeonTextRainbowTemplateV1: React.FC<NeonTextRainbowSchemaV1Type> = (
  props,
) => {
  const frame = useCurrentFrame();
  const { width: compositionWidth } = useVideoConfig();
  const gid = useId().replace(/:/g, "");
  const filterMainId = `${gid}-main`;
  const filterHaloId = `${gid}-halo`;

  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    hueCycleFrames,
    colorShiftEnabled,
    colorShiftStartFrame,
    colorShiftDurationFrames,
    strokeWidth,
    innerStrokeWidth,
    innerStrokeColor,
    mainGlowBlur,
    haloExtraWidth,
    haloGlowBlur,
    haloOpacity,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
    backgroundColor,
    vignetteOpacity,
  } = props;

  /** GlitchText と同じコンポジション px。SVG ユーザー座標用に補正（WireText と同じ式） */
  const captionInnerWidthPx =
    compositionWidth * ((100 - paddingLeftPercent - 2) / 100);
  const svgFontSize =
    (fontSize * VB_W) / Math.max(1, captionInnerWidthPx);

  const lines = useMemo(() => text.split("\n"), [text]);
  const lineGapPx = svgFontSize * lineHeight;
  const startDy = -((lines.length - 1) / 2) * lineGapPx;

  /**
   * viewBox 高さを本文＋縁・ハローにフィットさせる。
   * 固定で 200/20 等にすると meet 時に SVG の画面高さが不自然（20px 級に潰れる等）になる。
   */
  const { vbH, cy } = useMemo(() => {
    const lineCount = Math.max(1, lines.length);
    const lineBlock = lineCount * svgFontSize * lineHeight;
    const pad =
      strokeWidth +
      (haloExtraWidth > 0 ? haloExtraWidth * 0.45 : 0) +
      innerStrokeWidth +
      Math.min(36, 2.2 * mainGlowBlur + 1.4 * haloGlowBlur);
    const h = Math.ceil(lineBlock + pad);
    const clamped = Math.min(520, Math.max(56, h));
    return { vbH: clamped, cy: clamped / 2 };
  }, [
    lines.length,
    svgFontSize,
    lineHeight,
    strokeWidth,
    haloExtraWidth,
    innerStrokeWidth,
    mainGlowBlur,
    haloGlowBlur,
  ]);

  const buildTspans = (keyPrefix: string) =>
    lines.map((line, i) => (
      <tspan key={`${keyPrefix}-${i}`} x={TX} dy={i === 0 ? startDy : lineGapPx}>
        {line}
      </tspan>
    ));

  const activeFrame = frame - delayFrames;
  const cycle = Math.max(18, hueCycleFrames);
  const angle = (activeFrame * 360) / cycle;

  const warmBlend = !colorShiftEnabled
    ? 0
    : colorShiftDurationFrames <= 0
      ? activeFrame >= colorShiftStartFrame
        ? 1
        : 0
      : interpolate(
          activeFrame,
          [
            colorShiftStartFrame,
            colorShiftStartFrame + colorShiftDurationFrames,
          ],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        );

  const gradientStops = STOP_OFFSETS.map((offset, i) => ({
    offset,
    stopColor: colorShiftEnabled
      ? interpolateColors(warmBlend, [0, 1], [COOL_NEON[i], WARM_NEON[i]])
      : FULL_SPECTRUM_STOPS[i],
  }));

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
      easing: Easing.out(Easing.cubic),
    });
  }, [activeFrame, fadeInDuration]);

  const textCommon: React.SVGTextElementAttributes<SVGTextElement> = {
    x: TX,
    y: cy,
    textAnchor: "start",
    dominantBaseline: "middle",
    fill: "none",
    style: {
      fontFamily,
      fontWeight: fontWeight as string,
      fontSize: svgFontSize,
      letterSpacing,
    },
  };

  const strokeGradientId = `stroke-${gid}`;
  const wide = VB_W;
  /** 基準は左上→右下の斜め（45°）。その後 rotate(angle) で中心回転 */
  const gx1 = CX - wide;
  const gy1 = cy - wide;
  const gx2 = CX + wide;
  const gy2 = cy + wide;
  const showHalo = haloGlowBlur > 0 && haloOpacity > 0 && haloExtraWidth > 0;
  const showMainGlow = mainGlowBlur > 0;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 72% 58% at 50% 46%, transparent 0%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
        }}
      />
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
          <defs>
            <linearGradient
              id={strokeGradientId}
              gradientUnits="userSpaceOnUse"
              x1={gx1}
              y1={gy1}
              x2={gx2}
              y2={gy2}
              gradientTransform={`rotate(${angle} ${CX} ${cy})`}
            >
              {gradientStops.map((s) => (
                <stop key={s.offset} offset={s.offset} stopColor={s.stopColor} />
              ))}
            </linearGradient>

            {showMainGlow ? (
              <filter
                id={filterMainId}
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={mainGlowBlur}
                  result="b"
                />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ) : null}

            {showHalo ? (
              <filter
                id={filterHaloId}
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={haloGlowBlur}
                  result="hb"
                />
                <feMerge>
                  <feMergeNode in="hb" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ) : null}
          </defs>

          {showHalo ? (
            <text
              {...textCommon}
              stroke={`url(#${strokeGradientId})`}
              strokeWidth={strokeWidth + haloExtraWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={haloOpacity}
              filter={`url(#${filterHaloId})`}
            >
              {buildTspans("halo")}
            </text>
          ) : null}

          <text
            {...textCommon}
            stroke={`url(#${strokeGradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={showMainGlow ? `url(#${filterMainId})` : undefined}
          >
            {buildTspans("main")}
          </text>

          {innerStrokeWidth > 0 ? (
            <text
              {...textCommon}
              stroke={innerStrokeColor}
              strokeWidth={innerStrokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {buildTspans("inner")}
            </text>
          ) : null}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { OneTakeLogoSchemaV1Type } from "./onetake-logo-schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

/** ロゴのバー構成比。実アイコン（OneTakeアプリ側 assets/icon.png）の生成比率と一致させている。 */
const BAR_RATIOS = [0.38, 0.7, 1.0, 0.62, 0.32];
const VIEWBOX = 1024;
const BAR_W = 76;
const GAP = 48;
const MAX_H = 560;
/** 隣り合うバー間の位相差（rad）。バーごとにずらすことで、左→右へ波が伝っていくように見せる。 */
const PHASE_STEP = Math.PI / 2.5;

/**
 * OneTakeロゴの波打ちアニメーション。
 * アプリ側でloop再生する前提のため、フェードイン等「一度きり」の要素は持たせず、
 * 各バーの高さをsin波（frameの周期関数）だけで駆動している。尺を`wavePeriodFrames`と
 * 一致させておけば、最終フレーム→先頭フレームの位相が連続しシームレスにループする。
 *
 * `holdFrames > 0`の場合、`motionCyclesBeforeHold`周期分再生した後はframe=0相当の姿勢
 * （=周期の終わりと数式上一致する姿勢）で静止させ、その間だけ動きを止める。次周期の
 * 頭に戻ってもポーズが変わらないため、静止区間を挟んでもシームレスにループする。
 */
export const OneTakeLogoTemplateV1: React.FC<OneTakeLogoSchemaV1Type> = ({
  barColorTop,
  barColorBottom,
  backgroundColor,
  wavePeriodFrames,
  waveAmplitude,
  motionCyclesBeforeHold,
  holdFrames,
}) => {
  const rawFrame = useCurrentFrame();
  const activeMotionFrames = wavePeriodFrames * motionCyclesBeforeHold;
  const cycleLength = activeMotionFrames + holdFrames;
  const frameInCycle = rawFrame % cycleLength;
  const frame = Math.min(frameInCycle, activeMotionFrames);

  const totalW = BAR_W * BAR_RATIOS.length + GAP * (BAR_RATIOS.length - 1);
  const cx = VIEWBOX / 2;
  const cy = VIEWBOX / 2;
  const startX = cx - totalW / 2;

  const backdropColor = resolveCompositionBackdropColor(backgroundColor);

  return (
    <AbsoluteFill style={{ backgroundColor: backdropColor }}>
      <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} width="100%" height="100%">
        <defs>
          <linearGradient id="onetakeLogoBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={barColorTop} />
            <stop offset="100%" stopColor={barColorBottom} />
          </linearGradient>
          <filter
            id="onetakeLogoGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {BAR_RATIOS.map((ratio, i) => {
          const heightScale =
            1 +
            waveAmplitude *
              Math.sin(
                (frame / wavePeriodFrames) * Math.PI * 2 + i * PHASE_STEP,
              );
          const h = Math.max(MAX_H * ratio * heightScale, 0);
          const x = startX + i * (BAR_W + GAP);
          const y = cy - h / 2;

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={BAR_W}
              height={h}
              rx={BAR_W / 2}
              fill="url(#onetakeLogoBarGrad)"
              filter="url(#onetakeLogoGlow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  OneTakeLogoSchemaV1Type,
  PulseStyleV1,
} from "./onetake-logo-schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

/** ロゴのバー構成比。実アイコン（OneTakeアプリ側 assets/icon.png）の生成比率と一致させている。 */
const BAR_RATIOS = [0.38, 0.7, 1.0, 0.62, 0.32];
const VIEWBOX = 1024;
const BAR_W = 76;
const GAP = 48;
const MAX_H = 560;
const CENTER_INDEX = (BAR_RATIOS.length - 1) / 2;
/** 隣り合うバー間の位相差（rad）の基準値。バーごとにずらすことで拍動が伝っていくように見せる。 */
const PHASE_STEP = Math.PI / 2.5;

/**
 * chase用: 1バーぶんの立ち上がり/立ち下がりにかける時間（wavePeriodFramesに対する比率）。
 * `public/sownd wave.svg`の参照アニメーション（素早く伸びてゆっくり戻る）に合わせ、
 * 立ち上がりを短く・立ち下がりを長くしている。次のバーが立ち上がり始めても前のバーの
 * 下降テールが重なって残るため、左→右へカスケードしていくように見える。
 */
const CHASE_ATTACK_FRACTION = 0.12;
const CHASE_DECAY_FRACTION = 0.35;

/** sync/wave/centerOut/alternate用: pulseStyleごとに、バーindexから位相オフセット（rad）を決める */
function phaseOffsetFor(pulseStyle: PulseStyleV1, barIndex: number): number {
  switch (pulseStyle) {
    case "sync":
      // 全バー同位相 = 揃って呼吸する
      return 0;
    case "wave":
      // index順に位相がずれる = 左→右へ波が伝っていく
      return barIndex * PHASE_STEP;
    case "centerOut":
      // 中央からの距離で位相がずれる = 中心から外側へ広がる
      return Math.abs(barIndex - CENTER_INDEX) * PHASE_STEP;
    case "alternate":
      // 奇数/偶数で逆位相 = 交互に拡縮
      return (barIndex % 2) * Math.PI;
    default:
      return 0;
  }
}

/**
 * chase用: バーの高さスケールを直接返す（0〜1の目盛りで、1が自身の最大高さ）。
 * sin波の位相オフセットでは表現できない「素早く最大まで伸びてゆっくり戻る」非対称な
 * エンベロープのため、他のpulseStyleとは別関数として持たせている。
 */
function chaseHeightScale(
  barIndex: number,
  barCount: number,
  frame: number,
  wavePeriodFrames: number,
  waveAmplitude: number,
): number {
  const cyclePos = (((frame / wavePeriodFrames) % 1) + 1) % 1;
  const slotStart = barIndex / barCount;
  const localPhase = (((cyclePos - slotStart) % 1) + 1) % 1;

  let envelope = 0;
  if (localPhase < CHASE_ATTACK_FRACTION) {
    envelope = localPhase / CHASE_ATTACK_FRACTION;
  } else if (localPhase < CHASE_ATTACK_FRACTION + CHASE_DECAY_FRACTION) {
    envelope =
      1 - (localPhase - CHASE_ATTACK_FRACTION) / CHASE_DECAY_FRACTION;
  }

  const baselineScale = 1 - waveAmplitude;
  return baselineScale + (1 - baselineScale) * envelope;
}

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
  pulseStyle,
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
            pulseStyle === "chase"
              ? chaseHeightScale(
                  i,
                  BAR_RATIOS.length,
                  frame,
                  wavePeriodFrames,
                  waveAmplitude,
                )
              : 1 +
                waveAmplitude *
                  Math.sin(
                    (frame / wavePeriodFrames) * Math.PI * 2 +
                      phaseOffsetFor(pulseStyle, i),
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

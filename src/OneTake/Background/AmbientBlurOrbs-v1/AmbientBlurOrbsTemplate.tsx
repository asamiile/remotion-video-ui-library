import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { AmbientBlurOrbsSchemaV1Type } from "./ambient-blur-orbs-schema";

/**
 * asami.tokyo（OneTake LP）の`GlowField`（`hero`バリアント）を再現した円の配置。
 * Tailwindのユニット（1 = 4px）とアービトラリ値をpxへ変換済み。
 * 参照: asami.tokyo `app/(onetake)/ui.tsx` の `GlowField` / `onetake.css` の `@keyframes glow-drift`。
 */
const ORBS = [
  { colorKey: "topLeftColor" as const, size: 640, top: -180, leftPercent: 8, delayFrames: 0 },
  { colorKey: "bottomRightColor" as const, size: 520, top: 60, leftPercent: 72, delayFrames: 180 },
] as const;

/** CSSの`ease-in-out`（`cubic-bezier(.42,0,.58,1)`）と同一。各キーフレーム区間に同じ形で適用される。 */
const CSS_EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);

/** `@keyframes glow-drift`のキーフレームをそのまま移植（tx/tyは要素自身のサイズに対する%、CSSのtranslate%と同じ意味）。 */
const GLOW_DRIFT_KEYFRAMES = [
  { t: 0, tx: 0, ty: 0, scale: 1 },
  { t: 0.25, tx: 12, ty: -16, scale: 1.2 },
  { t: 0.5, tx: -9, ty: 14, scale: 0.85 },
  { t: 0.75, tx: -16, ty: -9, scale: 1.15 },
  { t: 1, tx: 0, ty: 0, scale: 1 },
];

/** progress(0〜1、1周期分)における現在のtranslate%・scaleを、CSSキーフレームアニメーションと同じ補間で求める */
function glowDriftAt(progress: number): { tx: number; ty: number; scale: number } {
  const p = ((progress % 1) + 1) % 1;
  let segmentIndex = GLOW_DRIFT_KEYFRAMES.length - 2;
  for (let i = 0; i < GLOW_DRIFT_KEYFRAMES.length - 1; i++) {
    if (p >= GLOW_DRIFT_KEYFRAMES[i].t && p < GLOW_DRIFT_KEYFRAMES[i + 1].t) {
      segmentIndex = i;
      break;
    }
  }
  const from = GLOW_DRIFT_KEYFRAMES[segmentIndex];
  const to = GLOW_DRIFT_KEYFRAMES[segmentIndex + 1];
  const localT = (p - from.t) / (to.t - from.t);
  const eased = CSS_EASE_IN_OUT(localT);
  return {
    tx: from.tx + (to.tx - from.tx) * eased,
    ty: from.ty + (to.ty - from.ty) * eased,
    scale: from.scale + (to.scale - from.scale) * eased,
  };
}

/**
 * スライド背景の「ぼやけた円」＝asami.tokyoの`GlowField`を再現するアンビエント背景パーツ。
 * 常時透明背景（他のコンポジションに重ねて使う前提）。ドリフトはCSSの`glow-drift`
 * キーフレームをそのまま移植しているため、尺を`driftPeriodFrames`（=14秒@30fps）と
 * 一致させれば最終フレーム→先頭フレームがシームレスにループする。
 */
export const AmbientBlurOrbsTemplateV1: React.FC<
  AmbientBlurOrbsSchemaV1Type
> = ({ topLeftColor, bottomRightColor, orbOpacity, blurPx, driftPeriodFrames }) => {
  const frame = useCurrentFrame();
  const colors = { topLeftColor, bottomRightColor };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {ORBS.map((orb, i) => {
        const progress = (frame + orb.delayFrames) / driftPeriodFrames;
        const { tx, ty, scale } = glowDriftAt(progress);
        const dxPx = (tx / 100) * orb.size;
        const dyPx = (ty / 100) * orb.size;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: orb.top,
              left: `${orb.leftPercent}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              backgroundColor: colors[orb.colorKey],
              opacity: orbOpacity,
              filter: `blur(${blurPx}px)`,
              transform: `translate(${dxPx}px, ${dyPx}px) scale(${scale})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

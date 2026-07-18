import { interpolate } from "remotion";

/**
 * asami.tokyo LP（`app/(onetake)/onetake.css` の `.cta-flicker`、CTAボタンのホバー時
 * ネオン点滅）をフレームベースに移植したもの。1.1秒を1周期とし、opacity/brightnessが
 * 明滅する「ネオン管が点灯する」演出。元CSSの `@keyframes cta-flicker` と同じ
 * パーセンテージ・値をそのまま移植している。
 */
export const CTA_FLICKER_CYCLE_MS = 1100;

const KEYFRAME_PERCENTS = [
  0, 17, 17.5, 18.5, 19, 20, 20.5, 21.5, 36, 36.5, 37, 37.5, 52, 52.5, 53,
  53.5, 100,
];
const KEYFRAME_OPACITIES = [
  1, 1, 0.25, 1, 0.7, 1, 0.25, 1, 1, 0.25, 0.7, 1, 1, 0.25, 0.7, 1, 1,
];
const KEYFRAME_BRIGHTNESS = [
  1, 1, 2.4, 1, 1.6, 1, 2.4, 1, 1, 2.4, 1.6, 1, 1, 2.4, 1.6, 1, 1,
];

export type CtaFlickerState = { opacity: number; brightness: number };

/**
 * @param elapsedMs 点灯演出の開始からの経過ミリ秒。負値（発火前）は常時点灯状態を返す。
 *   ループ再生したい場合は呼び出し側で `elapsedMs % CTA_FLICKER_CYCLE_MS` を渡す。
 *   1回だけ再生して点灯状態を保持したい場合は
 *   `Math.min(elapsedMs, CTA_FLICKER_CYCLE_MS)` を渡す。
 */
export function ctaFlickerAt(elapsedMs: number): CtaFlickerState {
  if (elapsedMs < 0) {
    return { opacity: 1, brightness: 1 };
  }
  const percent = (elapsedMs / CTA_FLICKER_CYCLE_MS) * 100;
  return {
    opacity: interpolate(percent, KEYFRAME_PERCENTS, KEYFRAME_OPACITIES, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    brightness: interpolate(percent, KEYFRAME_PERCENTS, KEYFRAME_BRIGHTNESS, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  };
}

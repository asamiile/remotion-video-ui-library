import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { AmbientBlurOrbsSchemaType } from "./ambient-blur-orbs.schema";

/**
 * Circle layout reproducing asami.tokyo's (OneTake LP) `GlowField` (`hero`
 * variant). Tailwind units (1 = 4px) and arbitrary values already converted to px.
 * Reference: `GlowField` in asami.tokyo's `app/(onetake)/ui.tsx` /
 * `@keyframes glow-drift` in `onetake.css`.
 */
const ORBS = [
  { colorKey: "topLeftColor" as const, size: 640, top: -180, leftPercent: 8, delayFrames: 0 },
  { colorKey: "bottomRightColor" as const, size: 520, top: 60, leftPercent: 72, delayFrames: 180 },
] as const;

/** Same as CSS `ease-in-out` (`cubic-bezier(.42,0,.58,1)`); applied identically to every keyframe segment. */
const CSS_EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);

/** Ported directly from the `@keyframes glow-drift` keyframes (tx/ty are % of the element's own size, same meaning as CSS translate%). */
const GLOW_DRIFT_KEYFRAMES = [
  { t: 0, tx: 0, ty: 0, scale: 1 },
  { t: 0.25, tx: 12, ty: -16, scale: 1.2 },
  { t: 0.5, tx: -9, ty: 14, scale: 0.85 },
  { t: 0.75, tx: -16, ty: -9, scale: 1.15 },
  { t: 1, tx: 0, ty: 0, scale: 1 },
];

/** Computes the current translate%/scale at progress (0-1, one full cycle), interpolating the same way as the CSS keyframe animation */
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
 * Ambient background piece reproducing the slide background's "blurred
 * circles" — asami.tokyo's `GlowField`. Always transparent background, meant
 * to be composited over other compositions. The drift is ported directly from
 * the CSS `glow-drift` keyframes, so matching the duration to
 * `driftPeriodFrames` (= 14s @ 30fps) makes the last frame → first frame loop
 * seamless.
 */
export const AmbientBlurOrbsTemplateV1: React.FC<
  AmbientBlurOrbsSchemaType
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

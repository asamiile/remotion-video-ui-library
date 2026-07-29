import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { OneTakeLogoSchemaV1Type } from "./onetake-logo.schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

/** Bar height ratios for the logo, matched to the generated proportions of the actual icon (OneTake app's assets/icon.png). */
const BAR_RATIOS = [0.38, 0.7, 1.0, 0.62, 0.32];
const VIEWBOX = 1024;
const BAR_W = 76;
const GAP = 48;
const MAX_H = 560;
/** Phase offset (rad) between adjacent bars; staggering each bar makes the wave appear to travel left-to-right. */
const PHASE_STEP = Math.PI / 2.5;

/**
 * OneTake logo's wave animation.
 * Assumes the app plays it on a loop, so there are no "one-shot" elements like
 * a fade-in — each bar's height is driven purely by a sine wave (a periodic
 * function of frame). As long as the duration matches `wavePeriodFrames`, the
 * phase is continuous across the last frame → first frame boundary, so the
 * loop is seamless.
 *
 * When `holdFrames > 0`, after playing `motionCyclesBeforeHold` cycles the
 * animation holds at the frame=0-equivalent pose (mathematically identical to
 * the end of a cycle) and pauses motion for that duration. Since the pose
 * doesn't change when the next cycle starts, inserting a hold segment still
 * loops seamlessly.
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

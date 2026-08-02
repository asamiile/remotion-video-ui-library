import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ShatterCrackTransitionSchemaType } from "./shatter-crack-transition.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const GROW_FRAMES = 14;

export const ShatterCrackTransitionTemplate: React.FC<
  ShatterCrackTransitionSchemaType
> = ({
  backgroundColor,
  crackColor,
  crackCount,
  crackMaxLengthPercent,
  shardCount,
  shardColorA,
  shardColorB,
  silhouetteEnabled,
  silhouetteColor,
  silhouetteSizePx,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  const diagonal = Math.sqrt(width * width + height * height);

  const growProgress = interpolate(frame, [0, GROW_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const cracks = useMemo(() => {
    return new Array(crackCount).fill(0).map((_, i) => {
      const angle =
        (i / crackCount) * Math.PI * 2 +
        (random(`${randomSeed}-angle-${i}`) - 0.5) * 0.4;
      const fullLength =
        (diagonal / 2) *
        (crackMaxLengthPercent / 100) *
        (0.5 + random(`${randomSeed}-len-${i}`) * 0.5);
      const length = fullLength * growProgress;

      const midT = 0.55;
      const jitterAngle =
        angle + (random(`${randomSeed}-jitter-${i}`) - 0.5) * 0.5;
      const midX = cx + Math.cos(jitterAngle) * length * midT;
      const midY = cy + Math.sin(jitterAngle) * length * midT;
      const endX = cx + Math.cos(angle) * length;
      const endY = cy + Math.sin(angle) * length;

      return { midX, midY, endX, endY, angle, fullLength };
    });
  }, [crackCount, crackMaxLengthPercent, diagonal, cx, cy, growProgress, randomSeed]);

  const shards = useMemo(() => {
    if (shardCount <= 0 || cracks.length === 0) {
      return [];
    }
    return new Array(shardCount).fill(0).map((_, i) => {
      const crack = cracks[i % cracks.length];
      const t = 0.3 + random(`${randomSeed}-shard-t-${i}`) * 0.65;
      const x = cx + (crack.endX - cx) * t;
      const y = cy + (crack.endY - cy) * t;
      const size = 6 + random(`${randomSeed}-shard-size-${i}`) * 16;
      const rotation = random(`${randomSeed}-shard-rot-${i}`) * 360;
      const useColorA = random(`${randomSeed}-shard-color-${i}`) > 0.5;
      const revealAt = 0.2 + (i / shardCount) * 0.7;
      const shardOpacity = growProgress > revealAt ? 1 : 0;
      return { x, y, size, rotation, color: useColorA ? shardColorA : shardColorB, opacity: shardOpacity };
    });
  }, [shardCount, cracks, cx, cy, randomSeed, shardColorA, shardColorB, growProgress]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {cracks.map((crack, i) => (
          <polyline
            key={i}
            points={`${cx},${cy} ${crack.midX},${crack.midY} ${crack.endX},${crack.endY}`}
            fill="none"
            stroke={crackColor as string}
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {shards.map((shard, i) => (
          <polygon
            key={i}
            points={`0,${-shard.size} ${shard.size * 0.87},${shard.size * 0.5} ${-shard.size * 0.87},${shard.size * 0.5}`}
            fill={shard.color as string}
            opacity={shard.opacity * 0.85}
            transform={`translate(${shard.x}, ${shard.y}) rotate(${shard.rotation})`}
          />
        ))}

        {silhouetteEnabled && (
          <g opacity={growProgress}>
            <circle
              cx={cx - silhouetteSizePx * 0.22}
              cy={cy}
              r={silhouetteSizePx / 2}
              fill="none"
              stroke={silhouetteColor as string}
              strokeWidth={3}
            />
            <circle
              cx={cx + silhouetteSizePx * 0.22}
              cy={cy}
              r={silhouetteSizePx / 2}
              fill="none"
              stroke={silhouetteColor as string}
              strokeWidth={3}
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

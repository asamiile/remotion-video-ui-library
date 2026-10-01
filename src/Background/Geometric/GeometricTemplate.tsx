import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import type { GeometricSchemaType } from "./geometric.schema";
import {
  FloatLayer,
  FrameLayer,
  GridLayer,
  MemphisLayer,
  OrbitLayer,
  StripeLayer,
} from "./layers";

const LAYERS = {
  frame: FrameLayer,
  orbit: OrbitLayer,
  grid: GridLayer,
  float: FloatLayer,
  stripe: StripeLayer,
  memphis: MemphisLayer,
} as const;

/** Flat geometric motion background; every motion loops over the composition. */
export const GeometricTemplate: React.FC<GeometricSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const idPrefix = `geo${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const phase = (frame / durationInFrames) * props.loopCycles;
  const from = resolveCompositionBackdropColor(props.backgroundColor);
  const to = resolveCompositionBackdropColor(props.backgroundColorEnd);
  const Layer = LAYERS[props.style];
  const elapsed = frame / fps;
  // Each shape takes the last 30% of the intro to appear, starting at its order.
  const revealAt = (order: number) =>
    props.intro === "reveal"
      ? Math.min(1, Math.max(0, (elapsed - order * props.introSeconds * 0.7) / (props.introSeconds * 0.3)))
      : 1;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          from === "transparent" ? undefined : `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <Layer {...props} width={width} height={height} phase={phase} idPrefix={idPrefix} revealAt={revealAt} />
      </svg>
    </AbsoluteFill>
  );
};

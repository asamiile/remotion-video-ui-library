import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const sceneUnderstandingModes = [
  "camera",
  "detection",
  "segmentation",
  "depth",
  "normals",
  "edges",
] as const;

export const sceneUnderstandingSchema = z.object({
  /** Shown in order; each one wipes in over the previous one */
  modes: z.array(z.enum(sceneUnderstandingModes)).min(1).max(6),
  /** Time each mode stays on screen, including its wipe */
  secondsPerMode: z.number().min(1.5).max(20),
  /** Detection boxes, edge map lines, wipe divider */
  lineColor: zColor(),
  /** Mode labels and legends */
  labelColor: zColor(),
  showLabels: z.boolean(),
  /** Street lengths travelled per loop; 0 parks the ego car */
  loopTravels: z.number().int().min(0).max(4),
});

export type SceneUnderstandingSchemaType = z.infer<typeof sceneUnderstandingSchema>;

export const sceneUnderstandingDurationFrames = (props: {
  modes: readonly string[];
  secondsPerMode: number;
}) => Math.max(150, Math.round(props.modes.length * props.secondsPerMode * 30));

export const defaultSceneUnderstandingProps = {
  modes: ["camera", "detection", "segmentation", "depth", "normals", "edges"],
  secondsPerMode: 2.5,
  lineColor: "#39ff88",
  labelColor: "#ffffff",
  showLabels: true,
  loopTravels: 1,
} as const;

export const sceneUnderstandingPatterns: Record<string, SceneUnderstandingSchemaType> = {
  fullStack: {
    ...defaultSceneUnderstandingProps,
    modes: [...defaultSceneUnderstandingProps.modes],
  },
  segmentation: {
    ...defaultSceneUnderstandingProps,
    modes: ["camera", "segmentation"],
    secondsPerMode: 5,
  },
  depthEdges: {
    ...defaultSceneUnderstandingProps,
    modes: ["depth", "edges"],
    secondsPerMode: 5,
    lineColor: "#4fd8ff",
  },
};

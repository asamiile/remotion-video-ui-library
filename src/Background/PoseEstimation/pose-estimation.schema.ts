import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const poseActions = ["walk", "wave", "jump", "squat", "dance"] as const;

export const poseEstimationSchema = z.object({
  /** "transparent" draws only the analysis, for layering over footage */
  backgroundColor: zColor(),
  /** Mannequin silhouettes standing in for the people being analyzed */
  figureColor: zColor(),
  /** Boxes, labels, HUD */
  boxColor: zColor(),
  figures: z
    .array(
      z.object({
        action: z.enum(poseActions),
        /** Horizontal position (0-1); walkers start here and wrap around */
        x: z.number().min(0).max(1),
        /** Figure height as a fraction of the frame height */
        scale: z.number().min(0.2).max(0.9),
        /** Facing / walking direction */
        direction: z.union([z.literal(1), z.literal(-1)]),
      }),
    )
    .min(1)
    .max(6),
  showSilhouette: z.boolean(),
  showBoxes: z.boolean(),
  /** Fading motion trails on wrists and ankles */
  showTrails: z.boolean(),
  showHud: z.boolean(),
  durationSeconds: z.number().int().min(5).max(60),
});

export type PoseEstimationSchemaType = z.infer<typeof poseEstimationSchema>;

export const poseEstimationDurationFrames = (props: { durationSeconds: number }) =>
  props.durationSeconds * 30;

export const defaultPoseEstimationProps: PoseEstimationSchemaType = {
  backgroundColor: "#07090d",
  figureColor: "#3b4350",
  boxColor: "#39ff88",
  figures: [
    { action: "walk", x: 0.1, scale: 0.42, direction: 1 },
    { action: "walk", x: 0.55, scale: 0.5, direction: 1 },
    { action: "walk", x: 0.35, scale: 0.36, direction: -1 },
    { action: "walk", x: 0.85, scale: 0.46, direction: -1 },
  ],
  showSilhouette: true,
  showBoxes: true,
  showTrails: false,
  showHud: true,
  durationSeconds: 10,
};

export const poseEstimationPatterns: Record<string, PoseEstimationSchemaType> = {
  crosswalk: defaultPoseEstimationProps,
  studio: {
    ...defaultPoseEstimationProps,
    boxColor: "#4fd8ff",
    figures: [
      { action: "wave", x: 0.2, scale: 0.55, direction: 1 },
      { action: "jump", x: 0.5, scale: 0.55, direction: 1 },
      { action: "dance", x: 0.8, scale: 0.55, direction: 1 },
    ],
    showTrails: true,
  },
  overlay: {
    ...defaultPoseEstimationProps,
    backgroundColor: "transparent",
    boxColor: "#ffffff",
    figures: [
      { action: "walk", x: 0.15, scale: 0.5, direction: 1 },
      { action: "squat", x: 0.62, scale: 0.55, direction: 1 },
      { action: "walk", x: 0.9, scale: 0.44, direction: -1 },
    ],
    showSilhouette: false,
    showTrails: true,
  },
};

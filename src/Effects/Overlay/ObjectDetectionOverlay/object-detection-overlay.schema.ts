import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const objectDetectionOverlaySchema = z.object({
  /** Boxes, labels, HUD text */
  primaryColor: zColor(),
  /** The locked target and its crosshair */
  lockColor: zColor(),
  /** Text drawn on top of filled label tags */
  tagTextColor: zColor(),
  title: z.string(),
  objects: z
    .array(
      z.object({
        label: z.string(),
        /** Base confidence, 0-1 */
        confidence: z.number().min(0).max(1),
      }),
    )
    .min(1)
    .max(8),
  /** Index into objects that gets a target lock; -1 for none */
  lockIndex: z.number().int().min(-1).max(7),
  boxScale: z.number().min(0.5).max(1.6),
  showGrid: z.boolean(),
  showScanLine: z.boolean(),
  showStats: z.boolean(),
  randomSeed: z.number().int().min(0).max(999),
  /** Loop length in seconds */
  durationSeconds: z.number().int().min(5).max(60),
});

export type ObjectDetectionOverlaySchemaType = z.infer<
  typeof objectDetectionOverlaySchema
>;

export const objectDetectionOverlayDurationFrames = (props: {
  durationSeconds: number;
}) => props.durationSeconds * 30;

export const defaultObjectDetectionOverlayProps = {
  primaryColor: "#39ff88",
  lockColor: "#ff4d4d",
  tagTextColor: "#03140a",
  title: "VISION MODEL // LIVE INFERENCE",
  objects: [
    { label: "PERSON", confidence: 0.97 },
    { label: "PERSON", confidence: 0.91 },
    { label: "VEHICLE", confidence: 0.88 },
    { label: "BICYCLE", confidence: 0.79 },
    { label: "DOG", confidence: 0.84 },
  ],
  lockIndex: 0,
  boxScale: 1,
  showGrid: true,
  showScanLine: true,
  showStats: true,
  randomSeed: 11,
  durationSeconds: 10,
} as const;

export const objectDetectionOverlayPatterns = {
  classic: defaultObjectDetectionOverlayProps,
  cyanTracker: {
    ...defaultObjectDetectionOverlayProps,
    primaryColor: "#4fd8ff",
    lockColor: "#ffb02e",
    tagTextColor: "#031018",
    title: "OPTICAL TRACKING // SECTOR 04",
    objects: [
      { label: "DRONE", confidence: 0.94 },
      { label: "PERSON", confidence: 0.89 },
      { label: "PERSON", confidence: 0.86 },
      { label: "BACKPACK", confidence: 0.72 },
    ],
    lockIndex: 0,
    randomSeed: 42,
  },
  minimal: {
    ...defaultObjectDetectionOverlayProps,
    primaryColor: "#f2f2f2",
    lockColor: "#f2f2f2",
    tagTextColor: "#0b0b0b",
    title: "OBJECT DETECTION",
    objects: [
      { label: "CUP", confidence: 0.96 },
      { label: "LAPTOP", confidence: 0.93 },
      { label: "PLANT", confidence: 0.81 },
    ],
    lockIndex: -1,
    showGrid: false,
    showScanLine: false,
    randomSeed: 5,
  },
};

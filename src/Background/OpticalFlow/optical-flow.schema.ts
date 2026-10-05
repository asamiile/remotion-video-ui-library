import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const opticalFlowSchema = z.object({
  /**
   * wheel: flow as color on white (zero motion = white);
   * dark: flow as color on black (zero motion = black);
   * camera: the camera image, dimmed, under the arrows
   */
  background: z.enum(["wheel", "dark", "camera"]),
  showArrows: z.boolean(),
  /** Arrow grid spacing in pixels */
  arrowSpacing: z.number().int().min(16).max(120),
  /** Arrow length per pixel of motion per frame */
  arrowScale: z.number().min(0.5).max(12),
  /** Fixed arrow color; leave empty to color arrows by flow direction */
  arrowColor: z.string(),
  /** Motion (pixels per frame) that maps to full saturation */
  maxFlow: z.number().min(1).max(60),
  hudColor: zColor(),
  showHud: z.boolean(),
  /** Street lengths travelled per loop */
  loopTravels: z.number().int().min(1).max(4),
  durationSeconds: z.number().int().min(5).max(60),
});

export type OpticalFlowSchemaType = z.infer<typeof opticalFlowSchema>;

export const opticalFlowDurationFrames = (props: { durationSeconds: number }) =>
  props.durationSeconds * 30;

export const defaultOpticalFlowProps = {
  background: "wheel",
  showArrows: false,
  arrowSpacing: 40,
  arrowScale: 3,
  arrowColor: "",
  maxFlow: 14,
  hudColor: "#111111",
  showHud: true,
  loopTravels: 1,
  durationSeconds: 10,
} as const;

export const opticalFlowPatterns: Record<string, OpticalFlowSchemaType> = {
  colorWheel: defaultOpticalFlowProps,
  darkVectors: {
    ...defaultOpticalFlowProps,
    background: "dark",
    showArrows: true,
    arrowSpacing: 36,
    hudColor: "#e8f6ff",
  },
  cameraArrows: {
    ...defaultOpticalFlowProps,
    background: "camera",
    showArrows: true,
    arrowSpacing: 48,
    arrowScale: 3.5,
    arrowColor: "#39ff88",
    hudColor: "#39ff88",
  },
};

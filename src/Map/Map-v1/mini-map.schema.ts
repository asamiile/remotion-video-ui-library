import { z } from "zod";

export const miniMapSchemaV1 = z.object({
  mapLocationId: z.string().default(""),

  width: z.number().min(100).max(1920).default(400),
  height: z.number().min(100).max(1080).default(300),

  positionX: z.number().default(50), // %
  positionY: z.number().default(50), // %

  enableCameraAnimation: z.boolean().default(false),

  showMarker: z.boolean().default(true),
  markerColor: z.string().default("#FFFFFF"),
  markerSize: z.number().min(1).max(50).default(16),

  fadeInDuration: z.number().min(1).default(30), // frames
  fadeOutDuration: z.number().min(1).default(30), // frames
  delayFrames: z.number().min(0).default(0),

  borderRadius: z.number().min(0).max(50).default(0),
  boxShadow: z.string().default("0px 4px 12px rgba(0, 0, 0, 0.15)"),
});

export type MiniMapSchemaV1Type = z.infer<typeof miniMapSchemaV1>;

export const miniMapV1DurationFrames = 3000;

export const defaultMiniMapV1Props = {
  mapLocationId: "",
  width: 340,
  height: 340,
  positionX: 88,
  positionY: 80,
  enableCameraAnimation: true,
  showMarker: true,
  markerColor: "#B27873",
  markerSize: 12,
  markerCanvasSize: 24,
  markerStrokeColor: "#B27873",
  markerStrokeWidth: 1,
  markerIconRotate: 45,
  markerIconOpacity: 0.9,
  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
  borderRadius: 0,
  border: "4px solid #C3C0BB",
  padding: "2px",
  boxShadow: "0px 4px 12px 8px rgba(107, 99, 84, 0.25)",
} as const;

export const miniMapV1Patterns = {
  default: defaultMiniMapV1Props,
} as const;

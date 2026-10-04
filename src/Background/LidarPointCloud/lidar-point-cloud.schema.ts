import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const lidarPointCloudSchema = z.object({
  /** "transparent" draws only the points, for layering */
  backgroundColor: zColor(),
  /** distance: turbo colormap by range; height: colorA→colorB by height; mono: colorA */
  colorMode: z.enum(["distance", "height", "mono"]),
  colorA: zColor(),
  colorB: zColor(),
  /** 3D detection boxes, ego car outline, HUD text */
  boxColor: zColor(),
  /** Number of laser rings */
  beams: z.number().int().min(16).max(128),
  /** Points per ring per full turn */
  pointsPerTurn: z.number().int().min(400).max(4000),
  /** Maximum range in scene units (about meters) */
  maxRange: z.number().min(20).max(120),
  showBoxes: z.boolean(),
  showGroundGrid: z.boolean(),
  showHud: z.boolean(),
  /** Sensor rotations per loop, drawn as a brighter sweep */
  sweepTurns: z.number().int().min(0).max(40),
  /** Street lengths travelled per loop; 0 parks the ego car */
  loopTravels: z.number().int().min(0).max(4),
  durationSeconds: z.number().int().min(5).max(60),
});

export type LidarPointCloudSchemaType = z.infer<typeof lidarPointCloudSchema>;

export const lidarPointCloudDurationFrames = (props: { durationSeconds: number }) =>
  props.durationSeconds * 30;

export const defaultLidarPointCloudProps = {
  backgroundColor: "#020305",
  colorMode: "distance",
  colorA: "#4fd8ff",
  colorB: "#ff4fd8",
  boxColor: "#39ff88",
  beams: 64,
  pointsPerTurn: 1800,
  maxRange: 70,
  showBoxes: true,
  showGroundGrid: true,
  showHud: true,
  sweepTurns: 10,
  loopTravels: 1,
  durationSeconds: 10,
} as const;

export const lidarPointCloudPatterns: Record<string, LidarPointCloudSchemaType> = {
  turbo: defaultLidarPointCloudProps,
  cyanMono: {
    ...defaultLidarPointCloudProps,
    colorMode: "mono",
    colorA: "#4fd8ff",
    boxColor: "#ffb02e",
    beams: 48,
  },
  heightPink: {
    ...defaultLidarPointCloudProps,
    backgroundColor: "transparent",
    colorMode: "height",
    colorA: "#7a5cff",
    colorB: "#ffd84f",
    boxColor: "#ff4fd8",
    beams: 96,
    pointsPerTurn: 2600,
    showGroundGrid: false,
  },
};

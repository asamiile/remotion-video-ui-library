import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const thermalDroneSchema = z.object({
  /** whiteHot / blackHot: grayscale; ironbow: black-purple-red-yellow-white */
  palette: z.enum(["whiteHot", "blackHot", "ironbow"]),
  /** Tracking brackets and HUD */
  hudColor: zColor(),
  /** Color of the brackets on vehicles */
  vehicleColor: zColor(),
  trackPeople: z.boolean(),
  trackVehicles: z.boolean(),
  showHud: z.boolean(),
  /** Drone altitude in scene units (about meters) */
  altitude: z.number().min(15).max(80),
  /** Sensor noise amount */
  noise: z.number().min(0).max(1),
  /** Street lengths travelled per loop; 0 hovers in place */
  loopTravels: z.number().int().min(0).max(4),
  durationSeconds: z.number().int().min(5).max(60),
});

export type ThermalDroneSchemaType = z.infer<typeof thermalDroneSchema>;

export const thermalDroneDurationFrames = (props: { durationSeconds: number }) =>
  props.durationSeconds * 30;

export const defaultThermalDroneProps = {
  palette: "whiteHot",
  hudColor: "#ffffff",
  vehicleColor: "#ffd84f",
  trackPeople: true,
  trackVehicles: true,
  showHud: true,
  altitude: 34,
  noise: 0.35,
  loopTravels: 1,
  durationSeconds: 10,
} as const;

export const thermalDronePatterns: Record<string, ThermalDroneSchemaType> = {
  whiteHot: defaultThermalDroneProps,
  ironbow: {
    ...defaultThermalDroneProps,
    palette: "ironbow",
    hudColor: "#7df9ff",
    vehicleColor: "#7df9ff",
    altitude: 28,
  },
  blackHotHover: {
    ...defaultThermalDroneProps,
    palette: "blackHot",
    hudColor: "#ff3b3b",
    vehicleColor: "#ff3b3b",
    trackVehicles: false,
    altitude: 24,
    loopTravels: 0,
  },
};

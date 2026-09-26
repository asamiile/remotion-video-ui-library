import {zColor} from "@remotion/zod-types";
import {z} from "zod";
export const radialAnalysisHUDSchema = z.object({title: z.string(), subject: z.string(), status: z.string(), primaryColor: zColor(), secondaryColor: zColor(), ringCount: z.number().int().min(2).max(10), gaugeValue: z.number().min(0).max(100), scale: z.number().min(0.4).max(1.8), rotationSpeed: z.number().min(-4).max(4)});
export type RadialAnalysisHUDProps = z.infer<typeof radialAnalysisHUDSchema>;
export const radialAnalysisHUDDurationFrames = 300;
export const defaultRadialAnalysisHUDProps = {title: "SYSTEM ANALYSIS", subject: "NODE 07", status: "SIGNAL ACTIVE", primaryColor: "#36edff", secondaryColor: "#7dffbf", ringCount: 5, gaugeValue: 74, scale: 1, rotationSpeed: 1} as const;
export const radialAnalysisHUDPatterns = {
  targetScan: {...defaultRadialAnalysisHUDProps},
  biometric: {...defaultRadialAnalysisHUDProps, title: "BIOMETRIC SAMPLE", subject: "SUBJECT 001", primaryColor: "#27f09a", gaugeValue: 88, rotationSpeed: -0.7},
  machineCore: {...defaultRadialAnalysisHUDProps, title: "CORE MONITOR", subject: "UNIT ALPHA", status: "STABLE", primaryColor: "#ffaf38", secondaryColor: "#ffefb0", ringCount: 7, gaugeValue: 61, scale: 1.18},
};

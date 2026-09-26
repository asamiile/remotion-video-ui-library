import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const holographicDepthGridSchema = z.object({
  backgroundColor: zColor(), gridColor: zColor(), accentColor: zColor(),
  horizonPercent: z.number().min(20).max(80), lineCount: z.number().int().min(4).max(40),
  rayCount: z.number().int().min(4).max(40), speed: z.number().min(0).max(4),
  orbSize: z.number().min(0).max(600), glowIntensity: z.number().min(0).max(2),
});
export type HolographicDepthGridProps = z.infer<typeof holographicDepthGridSchema>;
export const holographicDepthGridDurationFrames = 300;
export const defaultHolographicDepthGridProps = {backgroundColor: "#02070d", gridColor: "#26d9ff", accentColor: "#90fff0", horizonPercent: 48, lineCount: 18, rayCount: 20, speed: 1, orbSize: 260, glowIntensity: 1} as const;
export const holographicDepthGridPatterns = {
  cyanTunnel: {...defaultHolographicDepthGridProps},
  cyanGridOnly: {...defaultHolographicDepthGridProps, orbSize: 0},
  emeraldSphere: {...defaultHolographicDepthGridProps, backgroundColor: "#020a08", gridColor: "#20f0a0", accentColor: "#c4ffe9", orbSize: 340, speed: 0.65},
  amberAlert: {...defaultHolographicDepthGridProps, backgroundColor: "#0c0702", gridColor: "#ff9f2d", accentColor: "#ffe1a1", rayCount: 28, speed: 1.7},
};

import {zColor} from "@remotion/zod-types";
import {z} from "zod";
export const hologramFragmentTransitionSchema = z.object({primaryColor: zColor(), secondaryColor: zColor(), fragmentCount: z.number().int().min(6).max(120), spreadPx: z.number().min(20).max(1600), fragmentSize: z.number().min(5).max(180), mode: z.enum(["dissolve", "reassemble", "forwardBurst"]), randomSeed: z.string()});
export type HologramFragmentTransitionProps = z.infer<typeof hologramFragmentTransitionSchema>;
export const hologramFragmentTransitionDurationFrames = 90;
export const defaultHologramFragmentTransitionProps = {primaryColor: "#3af6ff", secondaryColor: "#9affdd", fragmentCount: 54, spreadPx: 720, fragmentSize: 64, mode: "dissolve", randomSeed: "hologram-fragments"} as const;
export const hologramFragmentTransitionPatterns: Record<string, HologramFragmentTransitionProps> = {
  dissolve: {...defaultHologramFragmentTransitionProps},
  reassemble: {...defaultHologramFragmentTransitionProps, mode: "reassemble", primaryColor: "#25efa1", fragmentCount: 72},
  forwardBurst: {...defaultHologramFragmentTransitionProps, mode: "forwardBurst", secondaryColor: "#ffbd52", spreadPx: 1200, fragmentSize: 92},
  magentaGold: {...defaultHologramFragmentTransitionProps, primaryColor: "#ff3bc8", secondaryColor: "#ffd05a", fragmentCount: 64, randomSeed: "hologram-fragments-magenta-gold"},
  redIce: {...defaultHologramFragmentTransitionProps, primaryColor: "#ff304f", secondaryColor: "#9eeaff", mode: "reassemble", fragmentCount: 78, randomSeed: "hologram-fragments-red-ice"},
  ultraviolet: {...defaultHologramFragmentTransitionProps, primaryColor: "#7b3cff", secondaryColor: "#efb4ff", mode: "forwardBurst", spreadPx: 1050, fragmentSize: 78, randomSeed: "hologram-fragments-ultraviolet"},
};

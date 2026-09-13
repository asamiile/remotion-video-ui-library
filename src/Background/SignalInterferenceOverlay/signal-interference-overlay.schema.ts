import {zColor} from "@remotion/zod-types";
import {z} from "zod";
export const signalInterferenceOverlaySchema = z.object({lineColor: zColor(), redChannel: zColor(), cyanChannel: zColor(), scanlineOpacity: z.number().min(0).max(1), blockCount: z.number().int().min(0).max(80), maxOffset: z.number().min(0).max(150), intensity: z.number().min(0).max(1), randomSeed: z.string()});
export type SignalInterferenceOverlayProps = z.infer<typeof signalInterferenceOverlaySchema>;
export const signalInterferenceOverlayDurationFrames = 150;
export const defaultSignalInterferenceOverlayProps = {lineColor: "#dffaff", redChannel: "#ff315f", cyanChannel: "#19eaff", scanlineOpacity: 0.16, blockCount: 18, maxOffset: 32, intensity: 0.55, randomSeed: "signal-interference"} as const;
export const signalInterferenceOverlayPatterns = {
  subtle: {...defaultSignalInterferenceOverlayProps, blockCount: 8, maxOffset: 12, intensity: 0.25},
  signalLoss: {...defaultSignalInterferenceOverlayProps, blockCount: 26, maxOffset: 58, intensity: 0.72},
  blockCorruption: {...defaultSignalInterferenceOverlayProps, blockCount: 42, maxOffset: 96, intensity: 0.9, scanlineOpacity: 0.28},
  acidViolet: {...defaultSignalInterferenceOverlayProps, lineColor: "#ebdfff", redChannel: "#b44cff", cyanChannel: "#baff2f", blockCount: 24, maxOffset: 54, intensity: 0.68, randomSeed: "signal-interference-acid-violet"},
  amberBlue: {...defaultSignalInterferenceOverlayProps, lineColor: "#fff1c2", redChannel: "#ff9b28", cyanChannel: "#287dff", blockCount: 30, maxOffset: 72, intensity: 0.76, randomSeed: "signal-interference-amber-blue"},
  monochrome: {...defaultSignalInterferenceOverlayProps, lineColor: "#ffffff", redChannel: "#d8d8d8", cyanChannel: "#737373", scanlineOpacity: 0.22, blockCount: 20, maxOffset: 44, intensity: 0.58, randomSeed: "signal-interference-monochrome"},
};

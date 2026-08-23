import {zColor} from "@remotion/zod-types";
import {z} from "zod";
export const signalSliceTransitionSchema = z.object({sliceColorA: zColor(), sliceColorB: zColor(), sliceCount: z.number().int().min(3).max(40), direction: z.enum(["horizontal", "diagonal"]), travelPx: z.number().min(0).max(1200), jitterPx: z.number().min(0).max(200), blackoutFrames: z.number().int().min(0).max(30), randomSeed: z.string()});
export type SignalSliceTransitionProps = z.infer<typeof signalSliceTransitionSchema>;
export const signalSliceTransitionDurationFrames = 60;
export const defaultSignalSliceTransitionProps = {sliceColorA: "#20e9ff", sliceColorB: "#ff315f", sliceCount: 14, direction: "horizontal", travelPx: 620, jitterPx: 70, blackoutFrames: 3, randomSeed: "signal-slice"} as const;
export const signalSliceTransitionPatterns: Record<string, SignalSliceTransitionProps> = {
  horizontalBands: {...defaultSignalSliceTransitionProps},
  diagonalCut: {...defaultSignalSliceTransitionProps, direction: "diagonal", sliceCount: 9, travelPx: 900},
  syncBreak: {...defaultSignalSliceTransitionProps, sliceCount: 26, jitterPx: 130, blackoutFrames: 7},
  acidViolet: {...defaultSignalSliceTransitionProps, sliceColorA: "#baff2f", sliceColorB: "#a442ff", randomSeed: "signal-slice-acid-violet"},
  amberBlue: {...defaultSignalSliceTransitionProps, sliceColorA: "#ff9b28", sliceColorB: "#2778ff", direction: "diagonal", travelPx: 820, randomSeed: "signal-slice-amber-blue"},
  monochrome: {...defaultSignalSliceTransitionProps, sliceColorA: "#ffffff", sliceColorB: "#606060", sliceCount: 20, jitterPx: 42, blackoutFrames: 5, randomSeed: "signal-slice-monochrome"},
};

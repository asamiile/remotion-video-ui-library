import {zColor} from "@remotion/zod-types";
import {z} from "zod";
export const splitScreenEchoSchema = z.object({label: z.string(), panelCount: z.number().int().min(2).max(6), layout: z.enum(["horizontal", "diagonal", "mirror"]), delayFrames: z.number().int().min(0).max(60), panelColor: zColor(), accentColor: zColor(), backgroundColor: zColor(), motionAmount: z.number().min(0).max(300)});
export type SplitScreenEchoProps = z.infer<typeof splitScreenEchoSchema>;
export const splitScreenEchoDurationFrames = 180;
export const defaultSplitScreenEchoProps = {label: "SEQUENCE SAMPLE", panelCount: 3, layout: "horizontal", delayFrames: 8, panelColor: "#0b1d28", accentColor: "#4beaff", backgroundColor: "#020509", motionAmount: 120} as const;
export const splitScreenEchoPatterns: Record<string, SplitScreenEchoProps> = {
  horizontalTriptych: {...defaultSplitScreenEchoProps},
  diagonalRepeat: {...defaultSplitScreenEchoProps, label: "FRAME ECHO", layout: "diagonal", panelCount: 4, accentColor: "#3cffaa"},
  mirrorPair: {...defaultSplitScreenEchoProps, label: "MIRROR CHANNEL", layout: "mirror", panelCount: 2, accentColor: "#ffb142", motionAmount: 80},
};

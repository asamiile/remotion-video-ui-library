import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const codeStreamDirectionSchema = z.enum(["horizontal", "vertical"]);

export const codeStreamLineSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    color: zColor().optional(),
  }).readonly(),
]);

export const codeStreamParagraphSchema = z
  .array(codeStreamLineSchema)
  .min(1)
  .readonly();

export const codeStreamSchema = z.object({
  direction: codeStreamDirectionSchema,
  paragraphs: z.array(codeStreamParagraphSchema).min(1).readonly().optional(),
  lines: z.array(codeStreamLineSchema).min(1).readonly().optional(),
  accentEvery: z.number().min(1).default(3),
  speedPxPerFrame: z.number().min(1).default(8),
  gapPx: z.number().min(0).default(96),
  textSize: z.number().min(12).default(28),
  lineHeight: z.number().min(12).default(38),
  letterSpacing: z.number().default(0.2),
  panelPaddingPx: z.number().min(0).default(40),
  panelRadiusPx: z.number().min(0).default(28),
  backgroundColor: zColor().default("#05070d"),
  primaryColor: zColor().default("#eef1fc"),
  flickerProbability: z.number().min(0).max(1).default(0.3),
  flickerWindowMs: z.number().min(100).default(850),
  endPaddingFrames: z.number().min(0).default(150),
});

export type CodeStreamSchemaType = z.infer<typeof codeStreamSchema>;
export type CodeStreamLineType = z.infer<typeof codeStreamLineSchema>;

export const defaultCodeStreamHorizontalProps = {
  direction: "horizontal",
  paragraphs: [[""]],
  accentEvery: 3,
  speedPxPerFrame: 10,
  gapPx: 96,
  textSize: 28,
  lineHeight: 38,
  letterSpacing: 0.2,
  panelPaddingPx: 40,
  panelRadiusPx: 28,
  backgroundColor: "#060810",
  primaryColor: "#eef1fc",
  flickerProbability: 0.5,
  flickerWindowMs: 900,
  endPaddingFrames: 150,
} as const;

export const defaultCodeStreamVerticalProps = {
  direction: "vertical",
  paragraphs: [[""]],
  accentEvery: 2,
  speedPxPerFrame: 7,
  gapPx: 36,
  textSize: 26,
  lineHeight: 34,
  letterSpacing: 0.25,
  panelPaddingPx: 36,
  panelRadiusPx: 24,
  backgroundColor: "#060810",
  primaryColor: "#eef1fc",
  flickerProbability: 0.5,
  flickerWindowMs: 900,
  endPaddingFrames: 150,
} as const;

export const codeStreamPatterns = {
  horizontal: defaultCodeStreamHorizontalProps,
  vertical: defaultCodeStreamVerticalProps,
};

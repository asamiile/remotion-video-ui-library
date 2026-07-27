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

export const codeStreamSchemaV1 = z.object({
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
});

export type CodeStreamSchemaV1Type = z.infer<typeof codeStreamSchemaV1>;
export type CodeStreamLineV1Type = z.infer<typeof codeStreamLineSchema>;

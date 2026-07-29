import { z } from "zod";

export const dottedLineMarkerTextSchemaV1 = z.object({
  fontSize: z.number().min(12).max(64).default(32),
  textColor: z.string().default("#EEF1FC"),
  backgroundColor: z.string().default("#060810"),
  items: z
    .array(
      z.object({
        leftText: z.string(),
        rightText: z.string(),
      })
    )
    .default([]),
});

export type DottedLineMarkerTextSchemaV1Type = z.infer<
  typeof dottedLineMarkerTextSchemaV1
>;

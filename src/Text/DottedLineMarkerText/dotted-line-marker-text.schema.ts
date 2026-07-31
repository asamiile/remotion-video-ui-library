import { z } from "zod";

export const dottedLineMarkerTextSchema = z.object({
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

export type DottedLineMarkerTextSchemaType = z.infer<
  typeof dottedLineMarkerTextSchema
>;

export const dottedLineMarkerTextDurationFrames = 3000;

export const defaultDottedLineMarkerTextProps: DottedLineMarkerTextSchemaType =
  {
    fontSize: 24,
    textColor: "#EEF1FC",
    backgroundColor: "#060810",
    items: [],
  };

export const dottedLineMarkerPatterns = {
  "01": {
    ...defaultDottedLineMarkerTextProps,
    randomSeed: "dotted-line-marker-01",
  },
  "02": {
    ...defaultDottedLineMarkerTextProps,
    randomSeed: "dotted-line-marker-02",
  },
};

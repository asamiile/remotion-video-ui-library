import { z } from "zod";

export const randomLinesSchemaV1 = z.object({
  lineCount: z.number().min(1).max(10).default(3),
  lineHeight: z.number().min(1).max(4).default(1),
  spawnIntervalFrames: z.number().min(10).default(45),
  displayDurationFrames: z.number().min(30).default(90),
  fadeInDuration: z.number().min(5).default(15),
  fadeOutDuration: z.number().min(5).default(15),
  lineColor: z.string().default("#EEF1FC"),
  backgroundColor: z.string().default("#060810"),
  lineOpacity: z.number().min(0).max(1).default(0.7),
  displayAreaHeightPx: z.number().min(100).max(1080).default(600),
  minLineSpacingPx: z.number().min(0).max(200).default(50),
  randomSeed: z.string().default("random-lines-default"),
});

export type RandomLinesSchemaV1Type = z.infer<typeof randomLinesSchemaV1>;

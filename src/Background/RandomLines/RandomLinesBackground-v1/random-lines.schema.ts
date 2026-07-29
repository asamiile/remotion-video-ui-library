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
  maxConcurrentLines: z.number().min(1).max(10).default(3),
  randomSeed: z.string().default("random-lines-default"),
});

export type RandomLinesSchemaV1Type = z.infer<typeof randomLinesSchemaV1>;

export const randomLinesV1DurationFrames = 3000;

export const defaultRandomLinesV1Props = {
  lineCount: 3,
  lineHeight: 1,
  spawnIntervalFrames: 45,
  displayDurationFrames: 90,
  fadeInDuration: 15,
  fadeOutDuration: 15,
  lineColor: "#EEF1FC",
  backgroundColor: "#060810",
  lineOpacity: 0.7,
  displayAreaHeightPx: 600,
  minLineSpacingPx: 50,
  maxConcurrentLines: 3,
  randomSeed: "random-lines-default",
} as const;

export const randomLinesV1Patterns = {
  subtle: {
    ...defaultRandomLinesV1Props,
    lineCount: 2,
    displayDurationFrames: 120,
    fadeOutDuration: 30,
    lineOpacity: 0.5,
    displayAreaHeightPx: 600,
    minLineSpacingPx: 50,
    maxConcurrentLines: 2,
    randomSeed: "random-lines-subtle",
  },
  prominent: {
    ...defaultRandomLinesV1Props,
    lineCount: 5,
    displayDurationFrames: 60,
    fadeOutDuration: 15,
    lineOpacity: 0.8,
    displayAreaHeightPx: 600,
    minLineSpacingPx: 50,
    maxConcurrentLines: 5,
    randomSeed: "random-lines-prominent",
  },
};

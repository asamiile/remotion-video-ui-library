import { RandomLinesSchemaV1Type } from "./random-lines-schema";

export const randomLinesV1DurationFrames = 3200;

export const defaultRandomLinesV1Props: RandomLinesSchemaV1Type = {
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
  randomSeed: "random-lines-default",
};

export const randomLinesV1Patterns = {
  subtle: {
    ...defaultRandomLinesV1Props,
    lineCount: 2,
    displayDurationFrames: 120,
    fadeOutDuration: 30,
    lineOpacity: 0.5,
    displayAreaHeightPx: 600,
    minLineSpacingPx: 50,
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
    randomSeed: "random-lines-prominent",
  },
};

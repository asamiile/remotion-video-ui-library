import { DottedLineMarkerTextSchemaV1Type } from "./dotted-line-marker-text-schema";

export const dottedLineMarkerTextV1DurationFrames = 3000;

export const defaultDottedLineMarkerTextV1Props: DottedLineMarkerTextSchemaV1Type =
  {
    fontSize: 24,
    textColor: "#EEF1FC",
    backgroundColor: "#060810",
    items: [],
  };

export const dottedLineMarkerV1Patterns = {
  default: {
    ...defaultDottedLineMarkerTextV1Props,
    randomSeed: "dotted-line-marker-default",
  },
};

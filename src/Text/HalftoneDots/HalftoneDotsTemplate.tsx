import React from "react";
import { AbsoluteFill } from "remotion";
import { HalftoneDotsTemplate } from "../../Background/HalftoneDots/HalftoneDotsTemplate";
import { halftoneDotsPatterns } from "../../Background/HalftoneDots/halftone-dots.schema";
import { CenteredTextLayer } from "../../helpers/centered-text-layer";
import type { HalftoneDotsTextSchemaType } from "./halftone-dots.schema";

/** Still text over the HalftoneDots background, which animates on its own. */
export const HalftoneDotsTextTemplate: React.FC<HalftoneDotsTextSchemaType> = ({
  backgroundPattern,
  backgroundColor,
  ...textProps
}) => {
  const background = halftoneDotsPatterns[backgroundPattern] ?? halftoneDotsPatterns.coral;

  return (
    <AbsoluteFill>
      <HalftoneDotsTemplate {...background} backgroundColor={backgroundColor} />
      <CenteredTextLayer {...textProps} />
    </AbsoluteFill>
  );
};

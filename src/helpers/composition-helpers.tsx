import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { withCanvasPreview as withCanvasPreviewImpl } from "../composition/with-canvas-preview";

const FPS = 30;

function capPattern(patternId: string) {
  return patternId
    .split(/[\W_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join("");
}

export function renderPatternFamily<Props extends Record<string, unknown>>({
  patterns,
  idPrefix,
  Template,
  schema,
  width = 1920,
  height = 1080,
  durationInFrames,
}: {
  patterns: Record<string, Props>;
  idPrefix: string;
  Template: React.FC<Props>;
  schema: z.ZodType<Props>;
  width?: number;
  height?: number;
  durationInFrames: number | ((patternProps: Props) => number);
}): React.ReactNode[] {
  return Object.entries(patterns).map(([patternId, patternProps]) => {
    const id = `${idPrefix}${capPattern(patternId)}`;
    return (
      <Composition
        key={patternId}
        id={id}
        component={withCanvasPreviewImpl(id, Template)}
        width={width}
        height={height}
        fps={FPS}
        durationInFrames={
          typeof durationInFrames === "function"
            ? durationInFrames(patternProps)
            : durationInFrames
        }
        schema={schema}
        defaultProps={patternProps}
      />
    );
  });
}

export { withCanvasPreviewImpl as withCanvasPreview };

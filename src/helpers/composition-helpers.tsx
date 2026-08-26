import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { withCanvasPreview as withCanvasPreviewImpl } from "../composition/with-canvas-preview";

const FPS = 30;

type DeepReadonly<T> = T extends readonly (infer Item)[]
  ? readonly DeepReadonly<Item>[]
  : T extends object
    ? {readonly [Key in keyof T]: DeepReadonly<T[Key]>}
    : T;

function capPattern(patternId: string) {
  return patternId.charAt(0).toUpperCase() + patternId.slice(1);
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
  patterns: Record<string, DeepReadonly<Props>>;
  idPrefix: string;
  Template: React.FC<Props>;
  schema: z.ZodType<Props>;
  width?: number;
  height?: number;
  durationInFrames: number | ((patternProps: Props) => number);
}): React.ReactNode[] {
  return Object.entries(patterns).map(([patternId, patternProps]) => {
    const id = `${idPrefix}${capPattern(patternId)}`;
    const props = patternProps as Props;
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
            ? durationInFrames(props)
            : durationInFrames
        }
        schema={schema}
        defaultProps={props}
      />
    );
  });
}

export { withCanvasPreviewImpl as withCanvasPreview };

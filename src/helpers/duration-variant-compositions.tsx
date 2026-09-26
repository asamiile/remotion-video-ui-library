import React from "react";
import { Composition, Sequence } from "remotion";
import { z } from "zod";
import { minimumCompositionFrames } from "../composition/composition-duration";
import { getDurationVariantWindow } from "../composition/duration-variants";
import { withCanvasPreview } from "../composition/with-canvas-preview";

export function renderDurationVariantCompositions<
  Props extends Record<string, unknown>,
>({
  id,
  Template,
  schema,
  props,
  width = 1920,
  height = 1080,
  fps = 30,
  durationInFrames,
}: {
  id: string;
  Template: React.FC<Props>;
  schema: z.ZodType<Props>;
  props: Props;
  width?: number;
  height?: number;
  fps?: number;
  durationInFrames: number | ((props: Props) => number);
}) {
  const window = getDurationVariantWindow(id, props);
  const variants = window
    ? (["", "-10s"] as const)
    : ([""] as const);
  return variants.map((suffix) => {
    const resolveDuration = (input: Props) => {
      if (window && suffix === "")
        return getDurationVariantWindow(id, input)!.frames;
      if (suffix === "-10s") return fps * 10;
      return minimumCompositionFrames(
        typeof durationInFrames === "function"
          ? durationInFrames(input)
          : durationInFrames,
        fps,
      );
    };
    const Content: React.FC<Props> = (input) => {
      const sourceStart =
        window && suffix === ""
          ? getDurationVariantWindow(id, input)!.sourceStart
          : 0;
      return sourceStart ? (
        <Sequence from={-sourceStart} layout="none">
          <Template {...input} />
        </Sequence>
      ) : (
        <Template {...input} />
      );
    };
    return (
      <Composition
        key={id + suffix}
        id={id + suffix}
        component={withCanvasPreview(id, Content)}
        schema={schema}
        defaultProps={props}
        width={width}
        height={height}
        fps={fps}
        durationInFrames={resolveDuration(props)}
        calculateMetadata={({ props: input }) => ({
          durationInFrames: resolveDuration(input as Props),
        })}
      />
    );
  });
}

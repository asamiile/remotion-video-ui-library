import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { type MediaSource, useMediaTexture } from "./media";
import { ShaderCanvas, type ShaderUniformValues } from "./ShaderCanvas";

/** Props every blend (clip-to-clip) transition exposes for its two clips. */
export const mediaBlendFields = {
  /** Outgoing clip: path under public/, URL, or "" for a placeholder */
  fromSrc: z.string(),
  fromStartSeconds: z.number().min(0),
  /** Incoming clip: path under public/, URL, or "" for a placeholder */
  toSrc: z.string(),
  toStartSeconds: z.number().min(0),
};

export const defaultMediaBlendProps = {
  fromSrc: "",
  fromStartSeconds: 0,
  toSrc: "",
  toStartSeconds: 0,
};

/**
 * ShaderCanvas fed with two clips as `uFrom` / `uTo` textures. Pair the
 * fragment shader with `mediaSamplingGlsl` to sample them.
 */
export const BlendShaderCanvas: React.FC<{
  fragmentShader: string;
  uniforms: ShaderUniformValues;
  from: MediaSource;
  to: MediaSource;
}> = ({ fragmentShader, uniforms, from, to }) => {
  const fromMedia = useMediaTexture(from);
  const toMedia = useMediaTexture(to);

  return (
    <AbsoluteFill>
      {fromMedia.element}
      {toMedia.element}
      <ShaderCanvas
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        textures={{ uFrom: fromMedia.texture, uTo: toMedia.texture }}
      />
    </AbsoluteFill>
  );
};

import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { inkTextureGlsl } from "./ink-texture.glsl";
import {
  INK_TEXTURE_STYLES,
  type InkTextureSchemaType,
} from "./ink-texture.schema";

/** Transparent ink texture: only the ink is opaque. */
export const InkTextureTemplate: React.FC<InkTextureSchemaType> = ({
  style,
  color,
  color2,
  density,
  size,
  tempo,
  randomSeed,
}) => (
  <ShaderBackgroundLayer
    backgroundColor="transparent"
    colorA={color}
    colorB={color2}
    colorC={color}
    scale={1}
    intensity={1}
    loopCycles={1}
    randomSeed={randomSeed}
    fragmentShader={inkTextureGlsl}
    extraUniforms={{
      uStyle: INK_TEXTURE_STYLES.indexOf(style),
      uDensity: density,
      uSize: size,
      uTempo: tempo,
    }}
  />
);

import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { sprayTextureGlsl } from "./spray-texture.glsl";
import {
  SPRAY_TEXTURE_STYLES,
  type SprayTextureSchemaType,
} from "./spray-texture.schema";

/** Transparent spray-paint texture: only the paint is opaque. */
export const SprayTextureTemplate: React.FC<SprayTextureSchemaType> = ({
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
    fragmentShader={sprayTextureGlsl}
    extraUniforms={{
      uStyle: SPRAY_TEXTURE_STYLES.indexOf(style),
      uDensity: density,
      uSize: size,
      uTempo: tempo,
    }}
  />
);

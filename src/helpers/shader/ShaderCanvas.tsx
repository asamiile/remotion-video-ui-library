import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

/**
 * Values accepted as shader uniforms. Arrays map to vecN (length 2-4);
 * CSS color strings should be converted with `cssColorToVec3` / `cssColorToVec4` first.
 */
export type ShaderUniformValue = number | boolean | readonly number[];
export type ShaderUniformValues = Record<string, ShaderUniformValue>;

/**
 * A loaded image/video texture plus the delayRender handle that keeps the
 * render waiting until the canvas has actually drawn with it.
 * See `useMediaTexture` in ./media.
 */
export type ShaderTexture = {
  texture: THREE.Texture;
  width: number;
  height: number;
  /** Continues the pending delayRender, if any. Idempotent. */
  release: () => void;
};
export type ShaderTextures = Record<string, ShaderTexture | null>;

const fullscreenVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Uniforms injected automatically into every fragment shader:
 * - `uResolution` (vec2): drawing-buffer size in pixels
 * - `uTime` (float): seconds since frame 0
 * - `uFrame` (float): current frame
 * - `vUv` (varying vec2): 0-1 screen coordinates
 */
export const shaderCanvasPrelude = /* glsl */ `
uniform vec2 uResolution;
uniform float uTime;
uniform float uFrame;
varying vec2 vUv;
`;

function toUniformValue(value: ShaderUniformValue) {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value;
  switch (value.length) {
    case 2:
      return new THREE.Vector2(value[0], value[1]);
    case 3:
      return new THREE.Vector3(value[0], value[1], value[2]);
    case 4:
      return new THREE.Vector4(value[0], value[1], value[2], value[3]);
    default:
      throw new Error(`Unsupported uniform array length: ${value.length}`);
  }
}

function assignUniform(uniform: THREE.IUniform, value: ShaderUniformValue) {
  const next = toUniformValue(value);
  if (
    uniform.value instanceof THREE.Vector2 ||
    uniform.value instanceof THREE.Vector3 ||
    uniform.value instanceof THREE.Vector4
  ) {
    uniform.value.copy(next as never);
  } else {
    uniform.value = next;
  }
}

const FullscreenQuad: React.FC<{
  fragmentShader: string;
  uniforms: ShaderUniformValues;
  textures: ShaderTextures;
  bufferWidth: number;
  bufferHeight: number;
}> = ({ fragmentShader, uniforms, textures, bufferWidth, bufferHeight }) => {
  const { advance } = useThree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Recompiled only when the shader source changes; uniforms are mutated below.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fullscreenVertexShader,
        fragmentShader: shaderCanvasPrelude + fragmentShader,
        uniforms: {
          uResolution: { value: new THREE.Vector2() },
          uTime: { value: 0 },
          uFrame: { value: 0 },
        },
        transparent: true,
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
      }),
    [fragmentShader],
  );

  // Assigned during render (not in an effect) so values are in place before
  // ThreeCanvas advances the frame while rendering.
  material.uniforms.uResolution.value.set(bufferWidth, bufferHeight);
  material.uniforms.uTime.value = frame / fps;
  material.uniforms.uFrame.value = frame;
  for (const [name, value] of Object.entries(uniforms)) {
    const uniform = (material.uniforms[name] ??= { value: null });
    assignUniform(uniform, value);
  }
  // Each texture `uX` also provides `uXSize` (pixels) and `uXReady` (0/1).
  for (const [name, entry] of Object.entries(textures)) {
    (material.uniforms[name] ??= { value: null }).value =
      entry?.texture ?? null;
    (material.uniforms[`${name}Size`] ??= {
      value: new THREE.Vector2(1, 1),
    }).value.set(entry?.width ?? 1, entry?.height ?? 1);
    (material.uniforms[`${name}Ready`] ??= { value: 0 }).value = entry ? 1 : 0;
  }

  // A texture can arrive after ThreeCanvas already drew this frame (it only
  // advances on frame changes), so draw again, then let the render continue.
  const latestTextures = useRef(textures);
  latestTextures.current = textures;
  const textureKey = Object.values(textures)
    .map((entry) => entry?.texture.uuid ?? "-")
    .join("|");
  useLayoutEffect(() => {
    advance(performance.now());
    for (const entry of Object.values(latestTextures.current)) entry?.release();
  }, [advance, textureKey]);

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

/**
 * Full-frame fragment-shader layer. Output is expected as premultiplied RGBA,
 * so transparent regions stay transparent in alpha exports.
 *
 * `resolutionScale` < 1 draws into a smaller buffer and stretches it to the
 * composition size — useful for heavy raymarching shaders.
 */
const noTextures: ShaderTextures = {};

export const ShaderCanvas: React.FC<{
  fragmentShader: string;
  uniforms?: ShaderUniformValues;
  /** sampler2D uniforms; see ShaderTexture */
  textures?: ShaderTextures;
  resolutionScale?: number;
}> = ({
  fragmentShader,
  uniforms = {},
  textures = noTextures,
  resolutionScale = 1,
}) => {
  const { width, height } = useVideoConfig();
  const bufferWidth = Math.max(2, Math.round(width * resolutionScale));
  const bufferHeight = Math.max(2, Math.round(height * resolutionScale));

  // ThreeCanvas pins the canvas CSS size to the buffer size, so stretch it
  // with a transform instead.
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: bufferWidth,
        height: bufferHeight,
        transform: `scale(${width / bufferWidth}, ${height / bufferHeight})`,
        transformOrigin: "0 0",
      }}
    >
      <ThreeCanvas
        width={bufferWidth}
        height={bufferHeight}
        dpr={1}
        flat
        linear
        gl={{
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          preserveDrawingBuffer: true,
        }}
      >
        <FullscreenQuad
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          textures={textures}
          bufferWidth={bufferWidth}
          bufferHeight={bufferHeight}
        />
      </ThreeCanvas>
    </div>
  );
};

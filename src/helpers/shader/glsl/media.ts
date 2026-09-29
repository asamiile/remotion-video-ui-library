/**
 * Sampling two clips ("from" and "to") in blend transitions.
 *
 * Declares the uniforms ShaderCanvas provides for the `uFrom` / `uTo`
 * textures (see ShaderTexture) and:
 * - coverUv(): object-fit: cover mapping from screen UV to texture UV
 * - sampleFrom()/sampleTo(): the clip, or a built-in placeholder scene when
 *   no source is set, so previews work without media
 */
export const mediaSamplingGlsl = /* glsl */ `
uniform sampler2D uFrom;
uniform vec2 uFromSize;
uniform float uFromReady;
uniform sampler2D uTo;
uniform vec2 uToSize;
uniform float uToReady;

vec2 coverUv(vec2 uv, vec2 textureSize) {
  float screenAspect = uResolution.x / uResolution.y;
  float textureAspect = textureSize.x / max(textureSize.y, 1.0);
  vec2 scale = screenAspect > textureAspect
    ? vec2(1.0, textureAspect / screenAspect)
    : vec2(screenAspect / textureAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

// Placeholder "from": warm sunset gradient with diagonal bands and a disc.
vec3 placeholderFrom(vec2 uv) {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec3 color = mix(vec3(0.98, 0.55, 0.3), vec3(0.55, 0.12, 0.35), uv.y);
  color *= 0.85 + 0.15 * step(0.5, fract((p.x + p.y) * 6.0));
  float disc = smoothstep(0.23, 0.22, length(p - vec2(-0.35, 0.05)));
  return mix(color, vec3(1.0, 0.9, 0.7), disc);
}

// Placeholder "to": cool teal gradient with a dot grid and a square.
vec3 placeholderTo(vec2 uv) {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec3 color = mix(vec3(0.05, 0.2, 0.35), vec3(0.1, 0.65, 0.7), uv.y);
  vec2 cell = fract(p * 10.0) - 0.5;
  color += 0.12 * smoothstep(0.12, 0.1, length(cell));
  vec2 q = abs(p - vec2(0.35, -0.05));
  float square = step(max(q.x, q.y), 0.2);
  return mix(color, vec3(0.85, 0.97, 1.0), square);
}

vec3 sampleFrom(vec2 uv) {
  uv = clamp(uv, 0.0, 1.0);
  if (uFromReady < 0.5) return placeholderFrom(uv);
  return texture2D(uFrom, coverUv(uv, uFromSize)).rgb;
}

vec3 sampleTo(vec2 uv) {
  uv = clamp(uv, 0.0, 1.0);
  if (uToReady < 0.5) return placeholderTo(uv);
  return texture2D(uTo, coverUv(uv, uToSize)).rgb;
}
`;

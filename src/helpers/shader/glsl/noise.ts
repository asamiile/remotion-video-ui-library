/**
 * Reusable GLSL noise snippets. Texture-free and hash-based, so results are
 * identical across Studio and headless renders.
 */

export const hashGlsl = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
`;

/** 3D value noise in [0, 1] and normalized fBm. Requires `hashGlsl`. */
export const valueNoise3dGlsl = /* glsl */ `
float valueNoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash13(i + vec3(0.0, 0.0, 0.0)), hash13(i + vec3(1.0, 0.0, 0.0)), u.x),
      mix(hash13(i + vec3(0.0, 1.0, 0.0)), hash13(i + vec3(1.0, 1.0, 0.0)), u.x),
      u.y),
    mix(
      mix(hash13(i + vec3(0.0, 0.0, 1.0)), hash13(i + vec3(1.0, 0.0, 1.0)), u.x),
      mix(hash13(i + vec3(0.0, 1.0, 1.0)), hash13(i + vec3(1.0, 1.0, 1.0)), u.x),
      u.y),
    u.z);
}

float fbm3(vec3 p, int octaves) {
  float sum = 0.0;
  float amplitude = 0.5;
  float norm = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    sum += amplitude * valueNoise3(p);
    norm += amplitude;
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    amplitude *= 0.5;
  }
  return sum / norm;
}
`;

/**
 * Offset that travels a closed loop through noise space. Feeding `phase` =
 * frame / durationInFrames (times an integer cycle count) makes noise-driven
 * animation loop seamlessly.
 */
export const loopOffsetGlsl = /* glsl */ `
vec3 loopOffset(float phase, float radius, float salt) {
  float a = 6.28318530718 * phase;
  return vec3(cos(a + salt), sin(a + salt), sin(a + salt * 1.7)) * radius;
}
`;

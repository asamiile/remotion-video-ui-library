import { hashGlsl, valueNoise3dGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Pixel-sorting melt: columns of sorted gradients drip down from the top
 * until the frame is covered, then their tails fall out the bottom. Each
 * streak is a banded gradient (like pixels sorted by brightness) with a
 * bright leading edge. Premultiplied RGBA.
 */
export const pixelSortGlsl = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform vec4 uBackground;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uProgress;
uniform float uFill;
uniform float uColumnWidth;
uniform float uSeed;

// Travel beyond the frame so every column clears it.
const float TRAVEL = 1.9;

void main() {
  vec2 px = vUv * uResolution;
  float column = floor(px.x / uColumnWidth);
  float x = column * uColumnWidth / uResolution.x;

  // Neighbouring columns start close together (coherent drips) with jitter.
  float delayIn = fbm3(vec3(x * 6.0, uSeed, 0.0), 3) * 0.55 + hash12(vec2(column, uSeed)) * 0.12;
  float delayOut = fbm3(vec3(x * 5.0, uSeed + 9.0, 1.0), 3) * 0.55 + hash12(vec2(column, uSeed + 3.0)) * 0.12;
  float speed = 0.8 + 0.5 * hash12(vec2(column, uSeed + 1.0));

  float inProgress = clamp(uProgress / 0.5, 0.0, 1.0);
  float outProgress = clamp((uProgress - 0.5) / 0.5, 0.0, 1.0);
  // Heads fall from the top (y = 1) and tails follow in the second half.
  float head = 1.0 - max(inProgress * 1.5 - delayIn, 0.0) * TRAVEL * speed;
  float tail = 1.0 - max(outProgress * 1.5 - delayOut, 0.0) * TRAVEL * speed;

  float covered = step(head, vUv.y) * step(vUv.y, tail);
  covered = max(covered, uFill * step(vUv.y, tail));

  // Sorted gradient behind the head, quantized into bands.
  float along = clamp((vUv.y - head) / 0.9, 0.0, 1.0);
  float hue = hash12(vec2(column, uSeed + 5.0));
  float t = floor((along * 0.8 + hue * 0.35) * 10.0) / 10.0;
  vec3 color = t < 0.5
    ? mix(uColorA, uColorB, t * 2.0)
    : mix(uColorB, uColorC, t * 2.0 - 1.0);
  // Bright leading edge of each drip.
  color = mix(color, vec3(1.0), exp(-max(vUv.y - head, 0.0) * uResolution.y / 6.0) * 0.8);

  float alpha = covered;
  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(color * alpha, alpha) + bg * (1.0 - alpha);
}
`;

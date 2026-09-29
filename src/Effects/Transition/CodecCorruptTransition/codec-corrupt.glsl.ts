import { hashGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Broken digital video: macroblocks corrupt in clumps until the frame is
 * covered, then drop out block by block. Each block shows a DCT-like
 * cosine pattern (the look of a damaged JPEG/H.264 block) in a flickering
 * palette color; some columns smear blocks vertically.
 * Premultiplied RGBA.
 */
export const codecCorruptGlsl = /* glsl */ `
${hashGlsl}

uniform vec4 uBackground;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uProgress;
uniform float uFill;
uniform float uStep;
uniform float uBlockSize;
uniform float uSeed;

const float PI = 3.14159265;

vec3 palette(float h) {
  return h < 0.4 ? uColorA : h < 0.75 ? uColorB : uColorC;
}

void main() {
  vec2 px = vUv * uResolution;
  vec2 cell = floor(px / uBlockSize);
  vec2 local = fract(px / uBlockSize);

  // Blocks corrupt in clumps: a coarse order plus per-block jitter.
  float orderIn = hash12(floor(cell / 4.0) + uSeed) * 0.65 + hash12(cell + uSeed * 1.3) * 0.35;
  float orderOut = hash12(floor(cell / 3.0) + uSeed + 40.0) * 0.6 + hash12(cell + uSeed + 7.0) * 0.4;
  float coverIn = smoothstep(0.0, 0.5, uProgress) * 1.05;
  float coverOut = smoothstep(0.5, 1.0, uProgress) * 1.05;
  float on = max(step(orderIn, coverIn), uFill) * (1.0 - step(orderOut, coverOut));

  // Some columns smear: blocks repeat down the column in long runs.
  float flick = floor(uStep / 3.0);
  float smear = step(0.8, hash12(vec2(cell.x, flick + uSeed)));
  vec2 source = mix(cell, vec2(cell.x, floor(cell.y / 7.0)), smear);

  float h = hash12(source + flick * 13.7 + uSeed);
  vec3 base = palette(hash12(source + uSeed * 2.1 + flick));

  // DCT-like basis pattern with low random frequencies.
  vec2 freq = floor(vec2(hash12(source + 3.3), hash12(source + 8.8)) * 4.0);
  float pattern = cos(local.x * PI * freq.x) * cos(local.y * PI * freq.y);
  float luma = 0.5 + 0.5 * pattern * mix(0.4, 1.0, h);
  vec3 color = base * mix(0.35, 1.1, luma);
  // Smeared blocks streak along their column.
  color *= mix(1.0, 0.75 + 0.35 * fract(local.y * 3.0 + h), smear);

  // Rare white-hot blocks.
  float hot = step(0.985, hash12(cell + flick * 5.1 + uSeed));
  color = mix(color, vec3(1.0), hot);

  float alpha = on;
  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(color * alpha, alpha) + bg * (1.0 - alpha);
}
`;

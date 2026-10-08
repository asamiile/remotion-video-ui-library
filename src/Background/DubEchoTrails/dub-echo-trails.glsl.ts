import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Dub delay marks, measured in 1080p pixels. Hits sit on a grid of uHits per
 * loop; for each pixel the most recent hits are walked back in time and every
 * tap (dry + repeats) that has already sounded is drawn with level
 * feedback^n, fading over a few delay times. Hit ids wrap with the loop,
 * so hits from the end of the loop echo seamlessly into its start.
 *
 * Marks snap to a layout grid: rings, squares, arcs and crosses to the
 * rule-of-thirds points and the center, lines flush to the side margins on a
 * row grid, columns standing on a shared baseline, dots on a 16x9 grid.
 * Repeats step toward the frame center and shrink, or widen concentrically.
 */
export const dubEchoTrailsGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

uniform float uStyle;
uniform float uBeats;
uniform float uBeatOffset;
uniform float uHits;
uniform float uHitEvery;
uniform float uDelay;
uniform float uFeedback;
uniform float uEchoes;
uniform float uSpread;
uniform float uLineWidth;
uniform float uSize;
uniform float uAccentEvery;

const float MARGIN = 0.08;

// Stroke of width w around distance d, softened by s pixels, plus a faint glow.
float stroke(float d, float w, float s) {
  float core = 1.0 - smoothstep(w * 0.5, w * 0.5 + s, d);
  return core + 0.1 * exp(-d / (5.0 + 2.0 * s));
}

float segment(vec2 d, vec2 halfSize) {
  return length(max(abs(d) - halfSize, 0.0));
}

// Thirds intersections, then the center; consecutive hits never share one.
vec2 ringAnchor(float id, float W) {
  float i = mod(id * 2.0 + floor(uSeed), 5.0);
  if (i < 0.5) return vec2(W / 3.0, 720.0);
  if (i < 1.5) return vec2(W * 2.0 / 3.0, 360.0);
  if (i < 2.5) return vec2(W / 2.0, 540.0);
  if (i < 3.5) return vec2(W / 3.0, 360.0);
  return vec2(W * 2.0 / 3.0, 720.0);
}

void main() {
  float W = uResolution.x / uResolution.y * 1080.0;
  vec2 q = vUv * vec2(W, 1080.0);
  float b = mod(uPhase * uBeats - uBeatOffset, uBeats);
  float current = floor(b / uHitEvery);
  float fadeBeats = uDelay * 2.5;
  float span = uEchoes * uDelay + fadeBeats * 3.0;

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  for (int j = 0; j < 16; j++) {
    float k = current - float(j);
    float t0 = k * uHitEvery;
    if (b - t0 > span) break;
    float id = mod(k, uHits);
    vec3 h = vec3(id * 1.37, uSeed * 0.11, 0.5);
    bool accent = uAccentEvery > 0.5 && mod(id, uAccentEvery) < 0.5;
    vec3 dry = accent ? uColorC : uColorA;
    float sizeRand = hash13(h + 4.9);
    // Lines alternate margins; columns alternate sides of the frame.
    float side = mod(id, 2.0) < 0.5 ? -1.0 : 1.0;
    float row = mod(id * 3.0 + floor(uSeed), 7.0);
    float lane = mod(id * 5.0 + floor(uSeed), 4.0);

    for (int e = 0; e < 9; e++) {
      float fe = float(e);
      if (fe > uEchoes) break;
      float age = b - (t0 + fe * uDelay);
      if (age < 0.0) break;
      float level = pow(uFeedback, fe) * exp(-age / fadeBeats) * (1.0 + 0.5 * exp(-age * 12.0));
      if (level < 0.004) continue;

      float w = uLineWidth * (1.0 + 0.15 * fe);
      float soft = 0.75 + 0.6 * fe;
      float shrink = max(0.15, 1.0 - 0.13 * fe);
      float cov;
      if (uStyle < 0.5) {
        // ring: concentric repeats widening from the same anchor
        vec2 c = ringAnchor(id, W);
        float r = (50.0 + 70.0 * sizeRand) * uSize + uSpread * fe;
        cov = stroke(abs(length(q - c) - r), w, soft);
      } else if (uStyle < 1.5) {
        // line: flush to a side margin, repeats step toward the vertical center
        float y = 1080.0 * (0.2 + row * 0.1);
        float toCenter = y < 540.0 ? 1.0 : -1.0;
        float len = (220.0 + 260.0 * sizeRand) * uSize * shrink;
        float edge = side < 0.0 ? W * MARGIN : W * (1.0 - MARGIN);
        vec2 c = vec2(edge - side * len, y + toCenter * uSpread * fe);
        cov = stroke(segment(q - c, vec2(len, 0.0)), w, soft);
      } else if (uStyle < 2.5) {
        // column: standing on the baseline, repeats step toward the horizontal center
        float x = side < 0.0 ? W * (MARGIN + lane * 0.06) : W * (1.0 - MARGIN - lane * 0.06);
        float len = (120.0 + 180.0 * sizeRand) * uSize * shrink;
        float base = 1080.0 * 0.14;
        vec2 c = vec2(x - side * uSpread * fe, base + len);
        cov = stroke(segment(q - c, vec2(0.0, len)), w, soft);
      } else if (uStyle < 3.5) {
        // square: concentric frames widening from the anchor
        vec2 c = ringAnchor(id, W);
        float boxHalf = (45.0 + 60.0 * sizeRand) * uSize + uSpread * fe;
        vec2 d = abs(q - c) - vec2(boxHalf);
        float box = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        cov = stroke(abs(box), w, soft);
      } else if (uStyle < 4.5) {
        // arc: a quarter-ish arc rotating a step with every repeat
        vec2 c = ringAnchor(id, W);
        float r = (60.0 + 80.0 * sizeRand) * uSize + uSpread * 0.5 * fe;
        vec2 d = q - c;
        float a0 = TAU * hash13(h + 3.7) + fe * 0.45 * side;
        float da = abs(mod(atan(d.y, d.x) - a0 + 3.14159265, TAU) - 3.14159265);
        float halfSpan = 0.9 - 0.06 * fe;
        cov = stroke(abs(length(d) - r), w, soft) * (1.0 - smoothstep(halfSpan - 0.04, halfSpan, da));
      } else if (uStyle < 5.5) {
        // cross: plus marks stepping from the anchor toward the frame center, shrinking
        vec2 a = ringAnchor(id, W);
        vec2 toward = vec2(W * 0.5, 540.0) - a;
        vec2 dirC = length(toward) > 1.0 ? normalize(toward) : vec2(1.0, 0.0);
        vec2 c = a + dirC * uSpread * 2.0 * fe;
        float arm = (30.0 + 30.0 * sizeRand) * uSize * shrink;
        vec2 d = q - c;
        float plus = min(segment(d, vec2(arm, 0.0)), segment(d, vec2(0.0, arm)));
        cov = stroke(plus, w, soft);
      } else {
        // dot: a dot on a 16x9 grid, repeats lighting the next dots toward the center column
        float cell = W / 16.0;
        vec2 g = vec2(mod(id * 7.0 + floor(uSeed), 14.0) + 1.0, mod(id * 3.0 + floor(uSeed * 0.5), 7.0) + 1.0);
        float stepX = g.x < 8.0 ? 1.0 : -1.0;
        vec2 c = (g + vec2(stepX * fe, 0.0)) * vec2(cell, 1080.0 / 9.0);
        float r = (6.0 + 4.0 * sizeRand) * uSize * shrink;
        cov = 1.0 - smoothstep(r - 0.75, r + 0.75 + 0.5 * fe, length(q - c));
      }

      vec3 tint = mix(dry, uColorB, smoothstep(0.0, 3.0, fe));
      float a = clamp(cov, 0.0, 1.0) * level;
      col += tint * a;
      alpha += a;
    }
  }

  if (uStyle > 5.5) {
    // Faint static grid the hits light up
    vec2 cs = vec2(W / 16.0, 1080.0 / 9.0);
    vec2 f = (fract(q / cs + 0.5) - 0.5) * cs;
    float g = (1.0 - smoothstep(1.2, 2.2, length(f))) * 0.2;
    col += uColorA * g;
    alpha += g;
  }

  alpha = clamp(alpha, 0.0, 1.0);
  emit(col, alpha);
}
`;

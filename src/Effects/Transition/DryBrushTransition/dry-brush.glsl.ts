import { hashGlsl, valueNoise3dGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Broad dry-brush strokes sweeping across the frame, staggered top to
 * bottom. Each stroke has bristle streaks stretched along its path, ragged
 * edges, a feathered head and gaps that grow as the paint runs out.
 */
const strokesGlsl = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform float uStrokeCount;
uniform float uDryness;
uniform float uSeed;

const int MAX_STROKES = 8;
const float STAGGER = 0.3;

// Paint coverage (x) and bristle shading (y) of one stroke.
vec2 brushStroke(vec2 p, float fi, float salt, float local, float aspect) {
  if (local <= 0.0) return vec2(0.0);
  float dir = mod(fi + salt, 2.0) < 1.0 ? 1.0 : -1.0;
  float angle = (hash12(vec2(fi, salt + uSeed)) - 0.5) * 0.22;
  float cs = cos(angle);
  float sn = sin(angle);
  vec2 r = mat2(cs, sn, -sn, cs) * p;

  float y0 = mix(0.95, -0.95, (fi + 0.5) / uStrokeCount);
  float halfHeight = 1.3 / uStrokeCount;
  float v = (r.y - y0) / halfHeight; // -1..1 across the stroke
  float x = r.x * dir;               // along the direction of travel
  float span = aspect + 0.6;
  float head = mix(-span, span, local);

  float streak = fbm3(vec3(x * 0.7, v * 20.0, fi * 5.3 + salt), 4);
  float fine = valueNoise3(vec3(x * 2.5, v * 85.0, fi + salt * 3.0));

  float edge = 1.0 - smoothstep(0.72, 1.0, abs(v) + (streak - 0.5) * 0.6);
  // Bristles lead unevenly, so the head is a ragged, feathered edge.
  float headMask = smoothstep(0.0, 0.18 + streak * 0.3, head - x + (streak - 0.5) * 0.7 + (fine - 0.5) * 0.15);
  // Paint runs out toward the end of each stroke.
  float travelled = clamp((x + span) / (2.0 * span), 0.0, 1.0);
  float dryness = smoothstep(0.3, 1.0, travelled) * uDryness;
  float load = smoothstep(dryness - 0.06, dryness + 0.06, streak * 0.8 + fine * 0.25);

  return vec2(edge * headMask * load, streak * 0.7 + fine * 0.3);
}

// Union of all strokes for a pass running 0 → 1.
vec2 brushPass(vec2 p, float progress, float salt, float aspect) {
  float total = 1.0 + STAGGER * (uStrokeCount - 1.0);
  float uncovered = 1.0;
  float shade = 0.0;
  for (int i = 0; i < MAX_STROKES; i++) {
    float fi = float(i);
    if (fi >= uStrokeCount) break;
    float local = clamp(progress * total - fi * STAGGER, 0.0, 1.0);
    vec2 s = brushStroke(p, fi, salt, local, aspect);
    shade = mix(shade, s.y, s.x);
    uncovered *= 1.0 - s.x;
  }
  return vec2(1.0 - uncovered, shade);
}
`;

/** Overlay: paint strokes cover the frame, then erasing strokes wipe it off. */
export const dryBrushOverlayGlsl = /* glsl */ `
${strokesGlsl}

uniform vec4 uBackground;
uniform vec3 uPaintColor;
uniform float uPaint;
uniform float uErase;
uniform float uFill;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;

  vec2 paint = brushPass(p, uPaint, 0.0, aspect);
  vec2 erase = brushPass(p, uErase, 1.0, aspect);

  float alpha = mix(paint.x, 1.0, uFill) * (1.0 - erase.x);
  // Dry gaps in the erasing strokes would leave specks; clear them at the end.
  alpha *= 1.0 - smoothstep(0.85, 1.0, uErase);
  // Bristle ridges catch the light; troughs hold darker pigment.
  vec3 color = uPaintColor * (0.78 + 0.4 * paint.y)
    + vec3(0.08) * smoothstep(0.62, 0.8, paint.y);

  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(color * alpha, alpha) + bg * (1.0 - alpha);
}
`;

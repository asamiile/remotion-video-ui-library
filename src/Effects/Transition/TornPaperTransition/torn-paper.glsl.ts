import { hashGlsl, valueNoise3dGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * A paper sheet slides in from the left with a torn leading edge (uSlide),
 * fully covers the frame, then rips along a jagged near-vertical line and
 * the two halves pull apart (uSplit). Torn edges show a pale fiber rim and
 * cast a soft shadow; the paper carries fiber texture and grime.
 */
export const tornPaperOverlayGlsl = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform vec4 uBackground;
uniform vec3 uPaperColor;
uniform vec3 uFiberColor;
uniform vec3 uGrimeColor;
uniform float uGrime;
uniform float uSeed;
uniform float uSlide;
uniform float uSplit;

// Jagged offset of a torn edge along y: broad wobble plus fine fibrous teeth.
float tornEdge(float y, float salt) {
  float broad = fbm3(vec3(y * 2.2, salt, uSeed), 4) - 0.5;
  float teeth = valueNoise3(vec3(y * 38.0, salt + 5.0, uSeed)) - 0.5;
  return broad * 0.28 + teeth * 0.035;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float reach = aspect + 0.45;

  // Signed distance-like value to the sheet's leading edge (positive = inside).
  float lead = mix(-reach, reach + 0.3, uSlide) + tornEdge(p.y, 1.0);
  float inSheet = p.x < lead ? 1.0 : 0.0;
  float rimLead = lead - p.x;

  // Rip: left half moves left and up, right half right and down.
  float apart = uSplit * uSplit * (reach + 0.6);
  vec2 pl = p + vec2(apart, -apart * 0.12);
  vec2 pr = p - vec2(apart, apart * 0.12);
  float tearL = tornEdge(pl.y, 7.0) * 1.3;
  float tearR = tornEdge(pr.y, 7.0) * 1.3;
  float inLeft = pl.x < tearL ? 1.0 : 0.0;
  float inRight = pr.x > tearR ? 1.0 : 0.0;

  float alpha;
  float rim;
  vec2 tp;
  if (uSplit <= 0.0) {
    alpha = inSheet;
    rim = rimLead;
    tp = p;
  } else {
    alpha = max(inLeft, inRight);
    rim = inLeft > 0.5 ? tearL - pl.x : pr.x - tearR;
    tp = inLeft > 0.5 ? pl : pr;
  }

  // Paper texture: fibers, mottling, grime stains and specks.
  float fiber = valueNoise3(vec3(tp.x * 60.0, tp.y * 9.0, uSeed));
  float mottle = fbm3(vec3(tp * 3.0, uSeed + 2.0), 4);
  vec3 color = uPaperColor * (0.9 + 0.12 * mottle + 0.06 * fiber);
  float stain = smoothstep(0.62, 0.78, fbm3(vec3(tp * 1.6, uSeed + 9.0), 4)) * uGrime;
  color = mix(color, uGrimeColor, stain * 0.35);
  float speck = step(1.0 - 0.012 * uGrime, hash12(floor(tp * 260.0) + uSeed));
  color = mix(color, uGrimeColor, speck * 0.6);

  // Pale fiber rim along torn edges, ragged in width.
  float rimWidth = 0.012 + 0.018 * valueNoise3(vec3(p.y * 30.0, 3.0, uSeed));
  color = mix(color, uFiberColor, (1.0 - smoothstep(rimWidth * 0.6, rimWidth, rim)) * alpha);

  // Soft shadow just outside the paper edges.
  float outside = 1.0 - alpha;
  float shadowDist = uSplit <= 0.0 ? p.x - lead : min(abs(pl.x - tearL), abs(pr.x - tearR));
  float shadow = outside * (1.0 - smoothstep(0.0, 0.06, shadowDist)) * 0.35 * step(0.0, shadowDist);

  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 paper = vec4(color * alpha, alpha);
  vec4 shade = vec4(0.0, 0.0, 0.0, shadow);
  gl_FragColor = paper + shade * (1.0 - paper.a) + bg * (1.0 - paper.a - shade.a * (1.0 - paper.a));
}
`;

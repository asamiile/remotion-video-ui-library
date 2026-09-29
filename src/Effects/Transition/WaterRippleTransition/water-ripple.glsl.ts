import { hashGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Damped circular waves from water drops. The surface height field gives a
 * gradient and a normal for the water shading and specular highlights.
 */
const rippleGlsl = /* glsl */ `
${hashGlsl}

uniform float uFrequency;
uniform float uAmplitude;
uniform float uDropCount;
uniform float uSeed;

// Wavefront radius per unit of age.
const float FRONT_SPEED = 2.5;

// Height of one drop's ripple; age runs 0 → 1 over its life.
float ripple(vec2 p, vec2 center, float age) {
  if (age <= 0.0) return 0.0;
  float r = length(p - center);
  float behind = age * FRONT_SPEED - r;
  float envelope = smoothstep(0.0, 0.06, behind) * exp(-max(behind, 0.0) * 1.4);
  float fade = exp(-age * 1.1);
  return sin(behind * uFrequency) * envelope * fade * uAmplitude;
}

vec2 dropCenter(float i, float salt) {
  if (i == 0.0) return vec2(0.0);
  return (vec2(hash12(vec2(i + salt, uSeed)), hash12(vec2(uSeed + 5.0, i + salt))) - 0.5) * vec2(2.8, 1.5);
}

// Main drop plus smaller follow-up drops that land a little later.
float surface(vec2 p, float age, float salt) {
  float h = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    if (fi >= uDropCount) break;
    float delay = fi == 0.0 ? 0.0 : 0.08 + 0.2 * hash12(vec2(fi + salt, uSeed + 2.0));
    h += ripple(p, dropCenter(fi, salt), age - delay) * (fi == 0.0 ? 1.0 : 0.55);
  }
  return h;
}

vec2 surfaceGradient(vec2 p, float age, float salt) {
  float e = 0.004;
  return vec2(
    surface(p + vec2(e, 0.0), age, salt) - surface(p - vec2(e, 0.0), age, salt),
    surface(p + vec2(0.0, e), age, salt) - surface(p - vec2(0.0, e), age, salt)) / (2.0 * e);
}

float specular(vec2 gradient) {
  vec3 normal = normalize(vec3(-gradient * 0.06, 1.0));
  vec3 light = normalize(vec3(-0.45, 0.55, 1.0));
  return pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 90.0);
}
`;

/** Overlay: water floods out from a drop to seal the frame, then drains through a second drop. */
export const waterRippleOverlayGlsl = /* glsl */ `
${rippleGlsl}

uniform vec4 uBackground;
uniform vec3 uWaterColor;
uniform vec3 uHighlightColor;
uniform float uFlood;
uniform float uDrain;
uniform float uFill;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;

  float h = surface(p, uFlood, 0.0) + surface(p, uDrain, 9.0);
  vec2 g = surfaceGradient(p, uFlood, 0.0) + surfaceGradient(p, uDrain, 9.0);

  float floodFront = uFlood * FRONT_SPEED - length(p - dropCenter(0.0, 0.0));
  float drainFront = uDrain * FRONT_SPEED - length(p - dropCenter(0.0, 9.0));
  float sheet = max(smoothstep(-0.015, 0.015, floodFront + h * 0.3), uFill);
  float hole = smoothstep(-0.015, 0.015, drainFront + h * 0.3) * step(0.0001, uDrain);

  float spec = specular(g);
  float crest = exp(-abs(floodFront) / 0.02) * step(0.0001, uFlood) * (1.0 - uFill)
    + exp(-abs(drainFront) / 0.02) * step(0.0001, uDrain);
  vec3 water = uWaterColor * (0.8 + 0.25 * h / max(uAmplitude, 1e-3))
    + uHighlightColor * (spec + (1.0 - normalize(vec3(-g * 0.06, 1.0)).z) * 0.8);

  float body = sheet * (1.0 - hole);
  // Glints stay visible on the transparent surface too.
  float glint = clamp(spec * 0.8 + crest * 0.7, 0.0, 1.0) * (1.0 - body);
  vec3 color = water * body + uHighlightColor * glint;
  float alpha = clamp(body + glint, 0.0, 1.0);

  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(min(color, vec3(alpha)), alpha) + bg * (1.0 - alpha);
}
`;

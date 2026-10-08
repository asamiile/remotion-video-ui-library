import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import { loopOffsetGlsl, valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Light leaks as soft gaussian blobs, domain-warped by fBm drifting along a
 * closed noise loop. Warm and cool leaks breathe in turn (whole breaths per
 * loop) and swell slightly on every beat. Output is premultiplied with
 * alpha = brightest channel, so Normal blending of the alpha export looks
 * close to Screen blending of the black-backed export.
 */
export const hazeBloomLeakGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform float uStyle;
uniform float uBeats;
uniform float uBeatOffset;
uniform float uBreathCycles;
uniform float uKick;
uniform float uGrain;

float beatPos() {
  return mod(uPhase * uBeats - uBeatOffset, uBeats);
}

// 0-1 breathing envelope; shift is in breaths.
float breath(float shift) {
  float b = 0.5 - 0.5 * cos(TAU * (uPhase * uBreathCycles + shift));
  return b * b * (3.0 - 2.0 * b);
}

// A swell rising over a couple of frames after each beat, gone before the next.
float kickSwell() {
  float f = fract(beatPos());
  return (1.0 - exp(-f * 25.0)) * exp(-f * 4.0);
}

vec2 warp(vec2 p, float salt) {
  vec3 o = loopOffset(uPhase, 0.5, salt);
  float nx = fbm3(vec3(p * 1.2, 0.0) + o, 4);
  float ny = fbm3(vec3(p * 1.2, 5.2) + o.yzx, 4);
  return p + (vec2(nx, ny) - 0.5) * 0.6;
}

float blob(vec2 p, vec2 c, vec2 r, float ang) {
  vec2 d = p - c;
  float cs = cos(ang);
  float sn = sin(ang);
  d = vec2(cs * d.x + sn * d.y, -sn * d.x + cs * d.y) / (r * uScale);
  return exp(-dot(d, d));
}

// Fringe in the leak color, core burning toward colorC.
vec3 leakColor(vec3 c, float g) {
  return c * g + uColorC * smoothstep(0.6, 1.5, g) * 0.8;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = centered();
  float s = uSeed * 0.731;
  float warm = 0.0;
  float cool = 0.0;
  vec3 col = vec3(0.0);

  if (uStyle < 0.5) {
    // edge
    vec2 q = warp(p, s);
    warm = blob(q, vec2(-aspect - 0.15, 0.3 * sin(TAU * uPhase + s)), vec2(0.6, 1.2), 0.15)
      + 0.6 * blob(q, vec2(-aspect + 0.2, -0.5 + 0.3 * sin(TAU * uPhase * 2.0 + s)), vec2(0.18, 0.7), -0.1);
    vec2 q2 = warp(p, s + 3.1);
    cool = blob(q2, vec2(aspect + 0.15, 0.3 * sin(TAU * uPhase + s + 2.0)), vec2(0.6, 1.2), -0.15)
      + 0.6 * blob(q2, vec2(aspect - 0.2, 0.5 + 0.3 * sin(TAU * uPhase * 2.0 + s + 1.0)), vec2(0.18, 0.7), 0.1);
  } else if (uStyle < 1.5) {
    // corner
    vec2 q = warp(p, s);
    warm = blob(q, vec2(-aspect, 1.0) + 0.15 * vec2(sin(TAU * uPhase + s), cos(TAU * uPhase + s)), vec2(1.2, 0.6), -0.55)
      + 0.5 * blob(q, vec2(-aspect * 0.4, 1.1), vec2(0.5, 0.25), -0.2);
    vec2 q2 = warp(p, s + 3.1);
    cool = blob(q2, vec2(aspect, -1.0) + 0.15 * vec2(cos(TAU * uPhase + s), sin(TAU * uPhase + s)), vec2(1.2, 0.6), -0.55)
      + 0.5 * blob(q2, vec2(aspect * 0.4, -1.1), vec2(0.5, 0.25), -0.2);
  } else if (uStyle < 2.5) {
    // haze: low-frequency fog, warm and cool areas trading places with the breath
    vec3 o = loopOffset(uPhase, 0.6, s);
    float h = fbm3(vec3(p * 0.55 / uScale, s) + o, 5);
    float fog = smoothstep(0.3, 0.85, h) * 1.1;
    float m = fbm3(vec3(p * 0.35 / uScale, s + 9.0) + o.zxy, 3);
    float t = smoothstep(0.3, 0.7, m + (breath(0.0) - 0.5) * 0.7);
    warm = fog * (1.0 - t);
    cool = fog * t;
  } else if (uStyle < 3.5) {
    // sweep: a tilted burn band crossing the frame once per breath, warm edge leading
    float t = fract(uPhase * uBreathCycles);
    vec2 q = warp(p, s);
    vec2 across = vec2(cos(0.35), sin(0.35));
    float d = dot(q, across) - mix(-aspect - 0.9, aspect + 0.9, t);
    float env = sin(3.14159265 * t);
    warm = exp(-pow((d - 0.15) / (0.22 * uScale), 2.0)) * env * 0.7;
    cool = exp(-pow((d + 0.3) / (0.38 * uScale), 2.0)) * env * 0.6;
  } else if (uStyle < 4.5) {
    // top: two washes falling from above like stage light
    vec2 q = warp(p, s);
    warm = blob(q, vec2(-aspect * 0.35 + 0.15 * sin(TAU * uPhase + s), 1.2), vec2(0.45, 1.05), 0.25);
    vec2 q2 = warp(p, s + 3.1);
    cool = blob(q2, vec2(aspect * 0.35 + 0.15 * sin(TAU * uPhase + s + 2.0), 1.2), vec2(0.45, 1.05), -0.25);
  } else {
    // streak: an anamorphic horizontal line with a warm hot spot gliding along it
    float y = 0.28 * sin(TAU * uPhase + s);
    float hx = 0.5 * aspect * sin(TAU * uPhase + s * 2.0);
    float dy = p.y - y;
    float dx = p.x - hx;
    float k = uScale * uScale;
    float line = exp(-dy * dy / (0.0008 * k)) * exp(-dx * dx / (aspect * aspect * 0.7));
    float glow = 0.45 * exp(-dy * dy / (0.018 * k)) * exp(-dx * dx / (aspect * aspect * 0.35));
    float y2 = -0.55 * y - 0.35;
    float line2 = 0.35 * exp(-pow(p.y - y2, 2.0) / (0.0006 * k)) * exp(-dx * dx / (aspect * aspect * 0.4));
    cool = (line + glow + line2) * 1.3;
    warm = exp(-(dx * dx * 3.0 + dy * dy * 40.0) / (0.05 * k)) * 1.4;
  }

  if (uStyle < 1.5 || (uStyle > 3.5 && uStyle < 4.5)) {
    warm *= mix(0.3, 1.0, breath(0.0));
    cool *= mix(0.3, 1.0, breath(0.5));
  } else if (uStyle > 4.5) {
    float b = mix(0.45, 1.0, breath(0.0));
    warm *= b;
    cool *= b;
  }

  col = leakColor(uColorA, warm) + leakColor(uColorB, cool);
  col *= uIntensity * (1.0 + uKick * 0.6 * kickSwell());
  col = 1.0 - exp(-col * 1.2);

  // Grain only modulates the light, so black stays clean for Screen blending.
  float n = hash13(vec3(gl_FragCoord.xy, uStep + uSeed)) - 0.5;
  col = clamp(col * (1.0 + n * uGrain * 0.6), 0.0, 1.0);

  emit(col, max(col.r, max(col.g, col.b)));
}
`;

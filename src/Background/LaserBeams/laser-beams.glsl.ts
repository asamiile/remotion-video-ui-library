import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import { loopOffsetGlsl, valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Laser beams in haze, measured in 1080p pixels (y up). Each beam is a ray:
 * a thin white-hot core, a colored scatter glow and a wide faint halo, the
 * glow and halo modulated by drifting smoke. Sweeps are whole cycles per
 * loop and the chase follows the beat grid, so the loop is seamless.
 * Output is premultiplied with alpha = brightest channel.
 */
export const laserBeamsGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform float uStyle;
uniform float uBeats;
uniform float uBeatOffset;
uniform float uBeamCount;
uniform float uSpread;
uniform float uSweep;
uniform float uSweepCycles;
uniform float uPulse;
uniform float uBeamWidth;
uniform float uHaze;
/** Sheet / scan height, 1080p pixels from the bottom */
uniform float uCenterY;

float beatPos() {
  return mod(uPhase * uBeats - uBeatOffset, uBeats);
}

float smoke(vec2 q) {
  vec3 o = loopOffset(uPhase, 0.8, uSeed * 0.37);
  float n = fbm3(vec3(q / 320.0, uSeed * 0.13) + o, 5);
  return mix(1.0, 0.1 + 2.2 * n * n, uHaze);
}

// Alternate beams flash on the beat; the rest dim.
float chase(float i) {
  float b = beatPos();
  float on = mod(i + floor(b), 2.0) < 0.5 ? 1.0 : 0.3;
  float flash = 0.65 + 0.35 * exp(-fract(b) * 4.0);
  return mix(1.0, on * flash, uPulse);
}

// One beam from s along unit dir; returns (core, glow).
vec2 ray(vec2 q, vec2 s, vec2 dir) {
  vec2 d = q - s;
  float t = max(dot(d, dir), 0.0);
  float dist = length(d - dir * t);
  float w = uBeamWidth * (1.0 + t / 1400.0);
  float fall = exp(-t / 2600.0);
  float core = exp(-(dist * dist) / (w * w)) * fall;
  float glow = (0.45 * exp(-dist / (w * 10.0)) + 0.1 * exp(-dist / (w * 70.0))) * fall;
  return vec2(core, glow);
}

vec3 beamColor(float i) {
  return mod(i, 2.0) < 0.5 ? uColorA : uColorB;
}

void main() {
  float W = uResolution.x / uResolution.y * 1080.0;
  vec2 q = vUv * vec2(W, 1080.0);
  float sm = smoke(q);
  float sw = sin(TAU * uPhase * uSweepCycles);
  vec3 col = vec3(0.0);

  if (uStyle < 1.5 || uStyle > 2.5) {
    for (int k = 0; k < 24; k++) {
      float i = float(k);
      if (i >= uBeamCount) break;
      float u = uBeamCount > 1.0 ? i / (uBeamCount - 1.0) - 0.5 : 0.0;
      float left = mod(i, 2.0) < 0.5 ? 1.0 : 0.0;
      float side = left > 0.5 ? 1.0 : -1.0;
      float level = chase(i);
      vec2 s;
      vec2 dir;
      if (uStyle < 0.5) {
        // fan: from the top center, pointing down
        float breathe = 0.85 + 0.15 * cos(TAU * uPhase * uSweepCycles * 2.0);
        float a = uSweep * sw + u * uSpread * breathe;
        s = vec2(W * 0.5, 1080.0 + 10.0);
        dir = vec2(sin(a), -cos(a));
      } else if (uStyle < 1.5) {
        // cross: half the beams from each bottom corner, sweeping in opposite directions
        float a = side * (0.6 + uSweep * sw) + u * uSpread;
        s = vec2(left > 0.5 ? W * 0.06 : W * 0.94, -10.0);
        dir = vec2(sin(a), cos(a));
      } else if (uStyle < 3.5) {
        // scan: near-horizontal beams from both side edges, tilting up and down in opposition
        float a = u * uSpread + side * uSweep * sw;
        s = vec2(left > 0.5 ? -10.0 : W + 10.0, uCenterY);
        dir = vec2(side * cos(a), sin(a));
      } else if (uStyle < 4.5) {
        // tunnel: a rotating cone from the top center; beams behind the axis dim
        float phi = TAU * i / uBeamCount + TAU * uPhase * uSweepCycles;
        float theta = uSpread * 0.5;
        float a = uSweep * sw;
        vec2 d0 = normalize(vec2(sin(theta) * cos(phi), -cos(theta)));
        dir = vec2(d0.x * cos(a) - d0.y * sin(a), d0.x * sin(a) + d0.y * cos(a));
        s = vec2(W * 0.5, 1080.0 + 10.0);
        level *= 0.3 + 0.7 * (0.5 + 0.5 * sin(phi));
      } else {
        // grid: fans from both top corners crossing into a lattice
        float a = side * (0.2 + (u + 0.5) * uSpread + uSweep * sw);
        s = vec2(left > 0.5 ? W * 0.02 : W * 0.98, 1080.0 + 10.0);
        dir = vec2(sin(a), -cos(a));
      }
      vec2 r = ray(q, s, dir);
      col += (uColorC * r.x * 1.4 + beamColor(i) * r.y * sm) * level;
    }
    // Emitter flares
    vec2 srcA;
    vec2 srcB;
    if (uStyle < 0.5 || (uStyle > 3.5 && uStyle < 4.5)) {
      srcA = vec2(W * 0.5, 1080.0);
      srcB = srcA;
    } else if (uStyle < 1.5) {
      srcA = vec2(W * 0.06, 0.0);
      srcB = vec2(W * 0.94, 0.0);
    } else if (uStyle < 3.5) {
      srcA = vec2(0.0, uCenterY);
      srcB = vec2(W, uCenterY);
    } else {
      srcA = vec2(W * 0.02, 1080.0);
      srcB = vec2(W * 0.98, 1080.0);
    }
    col += uColorC * 0.5 * exp(-length(q - srcA) / 18.0);
    if (length(srcA - srcB) > 1.0) col += uColorC * 0.5 * exp(-length(q - srcB) / 18.0);
  } else {
    // sheet: a thin plane of light seen from below, rippling and tilting
    float x = q.x;
    float y0 = uCenterY;
    float ripple = 34.0 * sin(x * 0.0042 + TAU * uPhase * uSweepCycles)
      + 18.0 * sin(x * 0.011 - TAU * uPhase * uSweepCycles * 2.0 + uSeed);
    float tilt = sin(uSweep) * sw * (x - W * 0.5);
    float ys = y0 + ripple + tilt;
    float dy = q.y - ys;
    float w = uBeamWidth * 1.6;
    float core = exp(-(dy * dy) / (w * w));
    // Underside glows more than the top; scan lines run across the plane.
    float under = dy < 0.0 ? exp(dy / 140.0) * 0.35 : exp(-dy / 50.0) * 0.15;
    float scan = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(x / W * uBeamCount * 3.0 * TAU + TAU * uPhase * uSweepCycles * 4.0), 4.0);
    vec3 tint = mix(uColorA, uColorB, smoothstep(0.1, 0.9, x / W));
    float level = mix(1.0, 0.7 + 0.3 * exp(-fract(beatPos()) * 4.0), uPulse);
    col = (uColorC * core * 1.2 + tint * (core * 0.6 + under * sm) * scan) * level;
    // Faint fan of rays from the emitter on the left edge, inside the plane
    vec2 src = vec2(-20.0, y0);
    col += uColorC * 0.4 * exp(-length(q - src) / 40.0);
  }

  col *= uIntensity;
  col = 1.0 - exp(-col * 1.3);
  emit(col, max(col.r, max(col.g, col.b)));
}
`;

import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import { valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Transparent spray paint, measured in 1080p pixels so dots keep their size
 * at any render scale. Every mark is drawn from a spray density (0-1):
 * solid where dense, atomized dots thinning out toward the edge, and a few
 * stray droplets beyond. Each burst / slash / drip lives in a slot that
 * restarts uTempo times per loop (an integer), punches in fast, then erodes
 * back into dots, so the texture loops seamlessly.
 */
export const sprayTextureGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}

uniform float uStyle;
uniform float uDensity;
uniform float uSize;
uniform float uTempo;

// Soft disc / line coverage with ~1px antialiasing.
float cover(float d, float r) {
  return 1.0 - smoothstep(r - 0.75, r + 0.75, d);
}

float frameWidth() {
  return uResolution.x / uResolution.y * 1080.0;
}

// Slot i restarts uTempo times per loop: x = age (0-1), y = cycle id wrapping with the loop.
vec2 slotCycle(float i) {
  float t = uPhase * uTempo + hash13(vec3(i, uSeed, 0.71));
  return vec2(fract(t), mod(floor(t), uTempo));
}

vec4 over(vec4 acc, vec3 col, float a) {
  return acc + vec4(col * a, a) * (1.0 - acc.a);
}

vec3 canColor(float h) {
  return mix(uColorA, uColorB, step(0.5, h));
}

// Erodes the paint back into dots over the last part of the cycle.
float erode(float age) {
  return 1.0 - smoothstep(0.62, 0.96, age);
}

// Atomized paint for a spray density d.
float spray(vec2 q, float d, float salt) {
  float grain = valueNoise3(vec3(q / (3.0 * uSize), salt));
  float solid = smoothstep(0.55, 0.8, d + (grain - 0.5) * 0.25);
  float cs = 4.0 * uSize;
  vec2 cell = floor(q / cs);
  vec3 k = vec3(cell, salt);
  vec2 c = (cell + 0.25 + 0.5 * vec2(hash13(k + 1.7), hash13(k + 2.9))) * cs;
  float fine = step(hash13(k), d * 1.2) * cover(length(q - c), (0.45 + 0.9 * hash13(k + 4.3)) * uSize);
  float cs2 = 11.0 * uSize;
  vec2 cell2 = floor(q / cs2);
  vec3 k2 = vec3(cell2, salt + 13.0);
  vec2 c2 = (cell2 + 0.3 + 0.4 * vec2(hash13(k2 + 1.1), hash13(k2 + 2.3))) * cs2;
  float stray = step(hash13(k2), smoothstep(0.01, 0.35, d) * 0.22)
    * cover(length(q - c2), (0.8 + 1.6 * hash13(k2 + 3.7)) * uSize);
  return max(solid, max(fine, stray));
}

// Spray shots: punch in from a solid core in a few frames, hold, erode.
vec4 bursts(vec2 q) {
  vec4 acc = vec4(0.0);
  float W = frameWidth();
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    if (fi >= 4.0 + uDensity * 8.0) break;
    vec2 cyc = slotCycle(fi);
    vec3 k = vec3(fi * 1.31, cyc.y * 7.7, uSeed);
    vec2 center = vec2((0.04 + 0.92 * hash13(k)) * W, (0.06 + 0.88 * hash13(k + 1.1)) * 1080.0);
    // A few big hero shots among smaller ones.
    float hero = step(0.8, hash13(k + 5.5));
    float sigma = (40.0 + 80.0 * hash13(k + 2.2) + hero * 90.0) * uSize;
    vec2 d = q - center;
    if (dot(d, d) > 16.0 * sigma * sigma) continue;
    float age = cyc.x;
    float build = smoothstep(0.0, 0.06, age);
    // Shot is slightly stretched along a random spray angle.
    float ang = hash13(k + 6.6) * TAU;
    vec2 ax = vec2(cos(ang), sin(ang));
    vec2 ld = vec2(dot(d, ax) * 0.78, dot(d, vec2(-ax.y, ax.x)));
    float salt = fi * 17.0 + cyc.y * 5.0 + uSeed;
    float lump = 0.75 + 0.5 * valueNoise3(vec3(d / (sigma * 0.8), salt));
    float dens = exp(-dot(ld, ld) / (2.0 * sigma * sigma)) * lump * (0.55 + 0.7 * build) * build;
    acc = over(acc, canColor(hash13(k + 3.3)), spray(q, dens * erode(age), salt));
  }
  return acc;
}

// Fast diagonal slashes: heavy where the nozzle starts, tapering out, swiped in ~10% of the cycle.
vec4 strokes(vec2 q) {
  vec4 acc = vec4(0.0);
  float W = frameWidth();
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    if (fi >= 3.0 + uDensity * 4.0) break;
    vec2 cyc = slotCycle(fi);
    vec3 k = vec3(fi * 2.17, cyc.y * 5.3, uSeed + 1.0);
    // Mostly bold diagonals, occasionally near-horizontal sweeps.
    float ang = mix(0.18, 0.85, hash13(k + 1.1)) * (step(0.5, hash13(k + 2.2)) * 2.0 - 1.0);
    ang += step(0.5, hash13(k + 3.3)) * 3.14159265;
    vec2 dir = vec2(cos(ang), sin(ang));
    vec2 nrm = vec2(-dir.y, dir.x);
    vec2 mid = vec2((0.2 + 0.6 * hash13(k + 4.4)) * W, (0.2 + 0.6 * hash13(k + 5.5)) * 1080.0);
    float len = (0.55 + 0.6 * hash13(k + 6.6)) * W;
    vec2 p0 = mid - dir * len * 0.5;
    vec2 d = q - p0;
    float u = dot(d, dir);
    // A slight bow, like a swinging arm.
    float bow = (hash13(k + 7.7) - 0.5) * 0.35 * len;
    float t = clamp(u / len, 0.0, 1.0);
    float v = dot(d, nrm) - bow * 4.0 * t * (1.0 - t);
    float width = (12.0 + 16.0 * hash13(k + 8.8)) * uSize;
    if (abs(v) > width * 5.0 || u < -width * 5.0 || u > len + width * 5.0) continue;
    float age = cyc.x;
    float swipe = 1.0 - pow(1.0 - smoothstep(0.0, 0.1, age), 3.0);
    float head = len * swipe;
    float pressure = mix(1.35, 0.5, t) * (0.85 + 0.3 * valueNoise3(vec3(u / 180.0, fi, uSeed)));
    float w = width * pressure;
    float along = u - clamp(u, 0.0, head);
    float dist = length(vec2(along, v));
    float dens = exp(-dist * dist / (2.0 * w * w)) * 1.15;
    // Heavy blob where the nozzle started.
    dens += exp(-dot(d, d) / (2.0 * width * width * 3.0)) * 0.5 * smoothstep(0.0, 0.02, age);
    float salt = fi * 23.0 + cyc.y * 3.0 + uSeed;
    acc = over(acc, canColor(hash13(k + 9.9)), spray(q, dens * erode(age), salt));
  }
  return acc;
}

// Heavy patches with paint running down in drips that end in a bulb.
vec4 drips(vec2 q) {
  vec4 acc = vec4(0.0);
  float W = frameWidth();
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    if (fi >= 2.0 + uDensity * 4.0) break;
    vec2 cyc = slotCycle(fi);
    vec3 k = vec3(fi * 3.07, cyc.y * 6.1, uSeed + 2.0);
    vec2 center = vec2((0.1 + 0.8 * hash13(k)) * W, (0.08 + 0.45 * hash13(k + 1.1)) * 1080.0);
    float sx = (100.0 + 150.0 * hash13(k + 2.2)) * uSize;
    float sy = (25.0 + 22.0 * hash13(k + 3.3)) * uSize;
    vec2 d = q - center;
    if (abs(d.x) > sx * 3.0 || d.y < -sy * 4.0 || d.y > 600.0 * uSize) continue;
    float age = cyc.x;
    float build = smoothstep(0.0, 0.06, age);
    float salt = fi * 31.0 + cyc.y * 7.0 + uSeed;
    float lump = 0.8 + 0.4 * valueNoise3(vec3(d / (sy * 1.5), salt));
    float dens = exp(-(d.x * d.x / (2.0 * sx * sx) + d.y * d.y / (2.0 * sy * sy))) * lump * 1.3 * build;
    float a = spray(q, dens * erode(age), salt);
    for (int jj = 0; jj < 6; jj++) {
      float fj = float(jj);
      vec3 kj = k + vec3(fj * 3.7, 9.1, 0.0);
      float on = step(hash13(kj), 0.35 + 0.6 * uDensity);
      float dx = (hash13(kj + 1.0) - 0.5) * 1.6 * sx;
      float maxLen = (100.0 + 420.0 * hash13(kj + 2.0)) * uSize;
      float g = smoothstep(0.06 + 0.1 * hash13(kj + 4.0), 0.45, age);
      float len = maxLen * (1.0 - (1.0 - g) * (1.0 - g));
      float dw = (2.0 + 3.5 * hash13(kj + 3.0)) * uSize;
      float xLine = center.x + dx + sin(d.y * 0.02 + fj) * 1.5;
      // Drips dry from the top down as the patch erodes.
      float top = len * smoothstep(0.62, 0.96, age);
      float along = step(top, d.y) * step(d.y, len);
      float taper = mix(1.0, 0.65, clamp(d.y / max(len, 1.0), 0.0, 1.0));
      float line = cover(abs(q.x - xLine), dw * taper) * along;
      float bulb = cover(length(vec2(q.x - xLine, d.y - len)), dw * 1.35) * step(1.0, len) * step(top, len - 1.0);
      a = max(a, on * max(line, bulb) * step(age, 0.97));
    }
    acc = over(acc, canColor(hash13(k + 4.4)), a);
  }
  return acc;
}

// Clouds of fine overspray swirling past on a closed path through noise.
vec4 mist(vec2 q) {
  float t = TAU * uPhase * uTempo;
  vec2 loopv = vec2(cos(t), sin(t)) * 0.6;
  float n = fbm3(vec3(q / (380.0 * uSize) + loopv, uSeed * 0.37), 4);
  float n2 = valueNoise3(vec3(q / (120.0 * uSize) - loopv * 1.5, uSeed + 5.0));
  float dens = smoothstep(0.62 - uDensity * 0.3, 0.95, n + (n2 - 0.5) * 0.25) * 0.8;
  float a = max(spray(q, dens, uSeed * 1.7), dens * 0.18);
  vec3 col = mix(uColorA, uColorB, smoothstep(0.4, 0.7, n2));
  return vec4(col * a, a);
}

// Spray-painted border pulsing around a clean center: a quick push in, slow release.
vec4 sprayFrame(vec2 q) {
  float W = frameWidth();
  float edgeDist = min(min(q.x, W - q.x), min(q.y, 1080.0 - q.y));
  float beat = fract(uPhase * uTempo);
  float release = 1.0 - smoothstep(0.05, 1.0, beat);
  float pulse = smoothstep(0.0, 0.05, beat) * release * release;
  float depth = (60.0 + 160.0 * uDensity) * uSize * (0.9 + 0.35 * pulse);
  float n = fbm3(vec3(q / (260.0 * uSize), uSeed + 0.5), 4);
  float dens = clamp(1.0 - edgeDist / depth + (n - 0.5) * 0.6, 0.0, 1.2);
  float a = spray(q, dens * dens, uSeed);
  return vec4(uColorA * a, a);
}

void main() {
  vec2 q = vUv * vec2(uResolution.x / uResolution.y, 1.0) * 1080.0;
  q.y = 1080.0 - q.y;
  vec4 res = uStyle < 0.5 ? bursts(q)
    : uStyle < 1.5 ? strokes(q)
    : uStyle < 2.5 ? drips(q)
    : uStyle < 3.5 ? mist(q)
    : sprayFrame(q);
  res = clamp(res, 0.0, 1.0);
  emit(res.rgb, res.a);
}
`;

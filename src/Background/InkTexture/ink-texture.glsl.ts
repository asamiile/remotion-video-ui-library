import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import { valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Transparent ink marks, measured in 1080p pixels so they keep their size at
 * any render scale. Splats, bleeds and brush slashes each live in a slot
 * that restarts uTempo times per loop (an integer), hit fast, then dissolve
 * through grainy noise; the flow clouds move on a closed path through noise.
 * Both keep the loop seamless.
 */
export const inkTextureGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}

uniform float uStyle;
uniform float uDensity;
uniform float uSize;
uniform float uTempo;

const float PI = 3.14159265359;

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

// Grainy dissolve over the last part of the cycle: 1 = intact, 0 = gone.
float dissolve(vec2 q, float age, float salt) {
  float n = valueNoise3(vec3(q / (16.0 * uSize), salt + 21.0)) * 0.7
    + valueNoise3(vec3(q / (3.0 * uSize), salt + 22.0)) * 0.3;
  float gone = smoothstep(0.62, 0.96, age) * 1.1;
  return smoothstep(gone - 0.04, gone + 0.04, n);
}

// Fine ink mist: random dots whose chance follows d.
float specks(vec2 q, float d, float salt) {
  float cs = 6.0 * uSize;
  vec2 cell = floor(q / cs);
  vec3 k = vec3(cell, salt);
  vec2 c = (cell + 0.3 + 0.4 * vec2(hash13(k + 1.7), hash13(k + 2.9))) * cs;
  return step(hash13(k), d) * cover(length(q - c), (0.6 + 1.2 * hash13(k + 4.3)) * uSize);
}

// Thrown splats: slam in with an overshoot, drops streak away along the throw.
vec4 splats(vec2 q) {
  vec4 acc = vec4(0.0);
  float W = frameWidth();
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    if (fi >= 3.0 + uDensity * 6.0) break;
    vec2 cyc = slotCycle(fi);
    vec3 k = vec3(fi * 1.37, cyc.y * 7.1, uSeed);
    vec2 center = vec2((0.06 + 0.88 * hash13(k)) * W, (0.08 + 0.84 * hash13(k + 1.1)) * 1080.0);
    float hero = step(0.78, hash13(k + 4.4));
    float R = (35.0 + 65.0 * hash13(k + 2.2) + hero * 70.0) * uSize;
    vec2 d = q - center;
    float r = length(d);
    if (r > R * 5.0) continue;
    float age = cyc.x;
    float land = smoothstep(0.0, 0.012, age);
    float overshoot = 0.16 * sin(PI * clamp((age - 0.008) / 0.05, 0.0, 1.0));
    float salt = fi * 11.0 + cyc.y * 5.0 + uSeed;
    float s = R * (0.4 + 0.6 * land) * (1.0 + overshoot);
    float throwAngle = hash13(k + 5.5) * TAU;
    vec2 throwDir = vec2(cos(throwAngle), sin(throwAngle));
    vec2 dirv = d / max(r, 1e-3);
    float facing = dot(dirv, throwDir);
    // Body: lumpy, spiky, bulging toward the throw.
    float lumps = valueNoise3(vec3(dirv * 1.6, salt));
    float spikes = pow(valueNoise3(vec3(dirv * 7.0, salt + 3.0)), 4.0);
    float edgeR = s * (0.72 + 0.45 * lumps + (0.9 + 0.8 * max(facing, 0.0)) * spikes + 0.25 * max(facing, 0.0));
    float body = cover(r, edgeR);
    // Satellite drops: one per angular sector, flung farther and stretched along the throw.
    float sectorAngle = TAU / 32.0;
    float sec = floor((atan(d.y, d.x) + PI) / sectorAngle);
    vec3 ks = vec3(sec, salt, 7.0);
    float midAngle = (sec + 0.5) * sectorAngle - PI;
    vec2 radial = vec2(cos(midAngle), sin(midAngle));
    float toward = max(dot(radial, throwDir), 0.0);
    float hd = hash13(ks);
    float fling = smoothstep(0.0, 0.05, age);
    float dropDist = s * (1.2 + (1.3 + 2.0 * toward) * hd) * (0.6 + 0.4 * fling);
    float dropR = R * (0.025 + 0.09 * hash13(ks + 1.0)) * (1.0 - 0.45 * hd);
    vec2 dd = d - radial * dropDist;
    float along = dot(dd, radial);
    float across = dot(dd, vec2(-radial.y, radial.x));
    float stretch = 0.6 - 0.4 * toward;
    float dropOn = step(hash13(ks + 2.0), 0.4 + 0.35 * uDensity + 0.3 * toward);
    float drop = dropOn * cover(length(vec2(along * stretch, across)), dropR) * land;
    float mistD = exp(-pow(max(r - edgeR, 0.0) / (s * (0.5 + 0.6 * toward)), 2.0)) * 0.4 * land;
    float a = max(body, max(drop, specks(q, mistD, salt)));
    acc = over(acc, mix(uColorA, uColorB, step(0.5, hash13(k + 3.3))), a * dissolve(q, age, salt));
  }
  return acc;
}

// Drops soaking into wet paper: feathered edge, dark rim, granulated fill.
vec4 bleeds(vec2 q) {
  vec4 acc = vec4(0.0);
  float W = frameWidth();
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    if (fi >= 2.0 + uDensity * 5.0) break;
    vec2 cyc = slotCycle(fi);
    vec3 k = vec3(fi * 1.91, cyc.y * 4.3, uSeed + 1.0);
    vec2 center = vec2((0.08 + 0.84 * hash13(k)) * W, (0.1 + 0.8 * hash13(k + 1.1)) * 1080.0);
    float R = (90.0 + 160.0 * hash13(k + 2.2)) * uSize;
    vec2 d = q - center;
    if (dot(d, d) > 2.6 * R * R) continue;
    float age = cyc.x;
    float g = smoothstep(0.0, 0.4, age);
    float grow = 1.0 - (1.0 - g) * (1.0 - g) * (1.0 - g);
    float r = R * (0.12 + 0.88 * grow);
    float salt = fi * 7.0 + cyc.y * 3.0 + uSeed;
    vec2 warp = vec2(fbm3(vec3(d / (R * 0.5), salt), 4), fbm3(vec3(d / (R * 0.5), salt + 9.0), 4)) - 0.5;
    float feather = fbm3(vec3((d + warp * R * 0.6) / (R * 0.12), salt + 4.0), 4);
    float dn = length(d + warp * R * 0.5) / r + (feather - 0.5) * 0.35;
    float inside = 1.0 - smoothstep(0.92, 1.0, dn);
    float rim = exp(-pow((dn - 0.95) / 0.05, 2.0));
    float gran = valueNoise3(vec3(q / (4.0 * uSize), salt + 2.0));
    float fill = 0.38 + 0.25 * smoothstep(0.2, 1.0, dn) + (gran - 0.5) * 0.18;
    float core = exp(-dot(d, d) / (2.0 * r * r * 0.0625)) * 0.35;
    float a = clamp(max(inside * (fill + core), rim * 0.85), 0.0, 1.0) * smoothstep(0.0, 0.02, age);
    acc = over(acc, mix(uColorA, uColorB, clamp(rim + core, 0.0, 1.0)), a * dissolve(q, age, salt));
  }
  return acc;
}

// Fast diagonal dry-brush slashes: pressed in at the start, streaks opening up as the brush runs dry.
vec4 brushes(vec2 q) {
  vec4 acc = vec4(0.0);
  float W = frameWidth();
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    if (fi >= 2.0 + uDensity * 4.0) break;
    vec2 cyc = slotCycle(fi);
    vec3 k = vec3(fi * 2.53, cyc.y * 5.9, uSeed + 2.0);
    float ang = mix(0.12, 0.7, hash13(k + 1.1)) * (step(0.5, hash13(k + 2.2)) * 2.0 - 1.0);
    ang += step(0.5, hash13(k + 3.3)) * PI;
    vec2 dir = vec2(cos(ang), sin(ang));
    vec2 nrm = vec2(-dir.y, dir.x);
    vec2 mid = vec2((0.2 + 0.6 * hash13(k + 4.4)) * W, (0.2 + 0.6 * hash13(k + 5.5)) * 1080.0);
    float len = (0.5 + 0.55 * hash13(k + 6.6)) * W;
    vec2 d = q - (mid - dir * len * 0.5);
    float u = dot(d, dir);
    float t0 = clamp(u / len, 0.0, 1.0);
    float bow = (hash13(k + 7.7) - 0.5) * 0.3 * len;
    float sd = dot(d, nrm) - bow * 4.0 * t0 * (1.0 - t0);
    float baseW = (24.0 + 34.0 * hash13(k + 8.8)) * uSize;
    if (abs(sd) > baseW * 1.8 || u < -60.0 || u > len + 60.0) continue;
    float age = cyc.x;
    float head = len * (1.0 - pow(1.0 - smoothstep(0.0, 0.09, age), 3.0));
    float salt = fi * 13.0 + cyc.y * 3.0 + uSeed;
    float t = t0;
    float width = baseW * (0.6 + 0.4 * smoothstep(0.0, 0.06, t)) * (1.0 - 0.5 * t)
      * (0.85 + 0.3 * valueNoise3(vec3(u / 300.0, salt, 1.0)));
    float v = sd / width;
    float bristle = valueNoise3(vec3(v * 9.0, u / (260.0 * uSize), salt)) * 0.6
      + valueNoise3(vec3(v * 23.0, u / (90.0 * uSize), salt + 2.0)) * 0.4;
    float ragged = valueNoise3(vec3(v * 3.0, u / (14.0 * uSize), salt + 5.0));
    float edge = 1.0 - smoothstep(0.8, 0.95, abs(v) + (bristle - 0.5) * 0.35 + (ragged - 0.5) * 0.25);
    // Streak gaps everywhere, opening up as the brush runs dry.
    float dry = 0.22 + smoothstep(0.25, 1.0, t) * 0.5;
    float inked = smoothstep(dry - 0.03, dry + 0.03, bristle + 0.15 * (1.0 - abs(v)) - 0.08);
    // Load: denser ink where the brush was pressed in, thinner wash elsewhere.
    float load = 0.78 + 0.22 * (1.0 - t) + (ragged - 0.5) * 0.12;
    float jag = (bristle - 0.5) * 50.0 * uSize;
    float span = smoothstep(-4.0, 18.0, u + jag * 0.6 + abs(v) * 14.0)
      * smoothstep(head, head - 25.0, u + jag) * smoothstep(len, len - 30.0, u + jag);
    float a = clamp(edge * inked * load, 0.0, 1.0) * span;
    acc = over(acc, mix(uColorA, uColorB, step(0.5, hash13(k + 10.1))), a * dissolve(q, age, salt));
  }
  return acc;
}

// Smoky ink clouds: domain-warped noise moving on a closed loop.
vec4 inkFlow(vec2 q) {
  vec2 p = q / (420.0 * uSize);
  float t = TAU * uPhase * uTempo;
  vec2 loopv = vec2(cos(t), sin(t)) * 0.45;
  vec2 w1 = vec2(fbm3(vec3(p + loopv, uSeed), 4), fbm3(vec3(p - loopv + 5.2, uSeed + 1.3), 4));
  vec2 w2 = vec2(
    fbm3(vec3(p + 2.2 * w1 + loopv * 0.5, uSeed + 2.0), 4),
    fbm3(vec3(p + 2.2 * w1 + 3.1, uSeed + 3.0), 4));
  float n = fbm3(vec3(p + 2.4 * w2, uSeed + 4.0), 5);
  // Soft, translucent wisps thickening into dense cores.
  float wisp = smoothstep(0.5 - 0.15 * uDensity, 0.75, n);
  float dense = smoothstep(0.66, 0.88, n);
  float a = clamp(wisp * 0.38 + dense * 0.55, 0.0, 1.0);
  vec3 col = mix(uColorB, uColorA, smoothstep(0.62, 0.85, n));
  return vec4(col * a, a);
}

void main() {
  vec2 q = vUv * vec2(uResolution.x / uResolution.y, 1.0) * 1080.0;
  q.y = 1080.0 - q.y;
  vec4 res = uStyle < 0.5 ? splats(q)
    : uStyle < 1.5 ? bleeds(q)
    : uStyle < 2.5 ? brushes(q)
    : inkFlow(q);
  res = clamp(res, 0.0, 1.0);
  emit(res.rgb, res.a);
}
`;

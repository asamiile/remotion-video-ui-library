import {
  hashGlsl,
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Layered drifting fog banks with glowing motes, composited back to front.
 * Every motion is driven by `uPhase` (0-1) so the composition loops.
 * Output is premultiplied RGBA over a transparent backdrop.
 */
export const digitalFogShaderFragmentShader = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform vec3 uFogColor;
uniform vec3 uParticleColor;
uniform float uLayerCount;
uniform float uParticleCount;
uniform float uOpacity;
uniform float uDrift;
uniform float uPhase;
uniform float uSeed;

const int MAX_LAYERS = 12;

// Glowing motes on a hashed grid. Cells wrap every screen width and the whole
// layer shifts by whole screen widths per loop, so the drift is seamless.
float motes(vec2 p, float aspect, float layer) {
  float cells = max(2.0, floor(sqrt(uParticleCount * aspect) * (0.8 + layer * 0.25)));
  float cellSize = 2.0 * aspect / cells;
  float shift = uPhase * 2.0 * aspect * (layer + 1.0);
  vec2 q = vec2(p.x + aspect + shift, p.y + 1.0) / cellSize;
  vec2 cell = floor(q);
  float glow = 0.0;
  for (int dx = -1; dx <= 1; dx++) {
    for (int dy = -1; dy <= 1; dy++) {
      vec2 c = cell + vec2(float(dx), float(dy));
      vec2 id = vec2(mod(c.x, cells), c.y) + uSeed * 13.1 + layer * 71.0;
      float h = hash12(id);
      if (h > 0.7) continue;
      vec2 pos = c + vec2(hash12(id + 3.1), hash12(id + 7.7));
      vec2 d = (q - pos) * cellSize;
      float size = mix(0.003, 0.009, hash12(id + 11.3)) * (0.7 + layer * 0.4);
      float twinkle = 0.55 + 0.45 * sin(6.28318530718 * (uPhase * 3.0 + h * 5.0));
      float r2 = dot(d, d);
      glow += (exp(-r2 / (size * size)) + 0.3 * exp(-r2 / (size * size * 18.0))) * twinkle;
    }
  }
  return glow;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;

  vec4 acc = vec4(0.0);
  // Far layers first: finer, dimmer, slower.
  for (int i = 0; i < MAX_LAYERS; i++) {
    float fi = float(i);
    if (fi >= uLayerCount) break;
    float depth = (fi + 0.5) / uLayerCount;
    float scale = mix(1.9, 0.75, depth);
    vec3 q = vec3(p * vec2(0.5, 1.3) * scale, fi * 3.1 + uSeed)
      + loopOffset(uPhase, uDrift * (0.35 + depth * 0.65), fi * 1.3);
    float n = fbm3(q, 5);
    float bandY = mix(0.85, -0.85, hash12(vec2(fi, uSeed + 4.0)));
    float band = exp(-pow((p.y - bandY) / 0.7, 2.0));
    float density = smoothstep(0.4, 0.8, n) * mix(0.35, 1.0, band);
    float a = clamp(density * uOpacity * (0.55 + depth * 0.6), 0.0, 1.0);
    vec3 color = uFogColor * (0.5 + 0.9 * smoothstep(0.55, 0.9, n));
    acc = vec4(color * a, a) + acc * (1.0 - a);
  }

  float glow = motes(p, aspect, 0.0) * 0.6 + motes(p, aspect, 1.0);
  float g = clamp(glow * uOpacity * 1.6, 0.0, 1.0);
  acc.rgb += uParticleColor * g;
  acc.a += g * (1.0 - acc.a);
  acc.rgb = min(acc.rgb, vec3(acc.a));

  gl_FragColor = acc;
}
`;

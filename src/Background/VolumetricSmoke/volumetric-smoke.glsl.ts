import { hashGlsl, valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Raymarched volumetric smoke. Front-to-back accumulation through a slab of
 * fBm density, lit with a directional-derivative shadow term and an inner
 * glow that shows through thin regions. Output is premultiplied RGBA.
 */
export const volumetricSmokeFragmentShader = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform vec4 uBackground;
uniform vec3 uSmokeColor;
uniform vec3 uShadowColor;
uniform vec3 uGlowColor;
uniform float uGlowStrength;
uniform float uDensity;
uniform float uCoverage;
uniform float uRadialBias;
uniform float uNoiseScale;
uniform float uSteps;
uniform float uStepJitter;
uniform float uOctaves;
uniform float uFill;
uniform vec3 uFlow;
uniform vec3 uEvolve;
uniform vec3 uLightDir;

const int MAX_STEPS = 128;
const float DEPTH = 4.0;

// Signed smoke field: > 0 inside the smoke. Kept unclamped so lighting can
// use its gradient even where the density saturates.
float smokeField(vec3 p, float screenRadius) {
  vec3 q = p * uNoiseScale;
  float warp = valueNoise3(q * 0.35 + uEvolve) - 0.5;
  float n = fbm3(q + uFlow + warp * 1.1, int(uOctaves));
  float threshold = mix(0.78, 0.34, uCoverage);
  float radial = uRadialBias * (0.55 - screenRadius) * 0.45;
  return n - threshold + radial;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 sp = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float screenRadius = length(sp / vec2(aspect, 1.0));
  // Near-orthographic camera: strong perspective smears the noise radially.
  vec3 ro = vec3(sp * 0.9, 0.0);
  vec3 rd = normalize(vec3(sp * 0.12, 1.0));
  vec3 lightDir = normalize(uLightDir);

  float steps = max(uSteps, 1.0);
  float dt = DEPTH / steps;
  float t = 0.35 + dt * hash12(gl_FragCoord.xy) * uStepJitter;

  vec4 acc = vec4(0.0);
  for (int i = 0; i < MAX_STEPS; i++) {
    if (float(i) >= steps || acc.a > 0.995) break;
    vec3 p = ro + rd * t;
    float f = smokeField(p, screenRadius);
    float d = clamp(f * 3.0, 0.0, 1.0);
    if (d > 0.002) {
      float fl = smokeField(p + lightDir * 0.25, screenRadius);
      float diffuse = clamp(0.5 + (f - fl) * 7.0, 0.0, 1.0);
      float depth = clamp(t / DEPTH, 0.0, 1.0);
      vec3 color = mix(uShadowColor, uSmokeColor, diffuse * diffuse);
      // Aerial perspective: distant layers fade toward the lit smoke color.
      color = mix(color, uSmokeColor, pow(depth, 1.3) * 0.75);

      float hot = valueNoise3(p * uNoiseScale * 0.45 + uEvolve * 0.6 + 11.0);
      float glow = uGlowStrength * smoothstep(0.42, 0.85, hot) * smoothstep(0.2, 0.8, depth) * (1.0 - d * 0.5);
      color = mix(color, uGlowColor, clamp(glow * 0.75, 0.0, 0.9));

      float a = 1.0 - exp(-d * uDensity * dt * 3.0);
      acc.rgb += color * a * (1.0 - acc.a);
      acc.a += a * (1.0 - acc.a);
    }
    t += dt;
  }

  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 result = acc + bg * (1.0 - acc.a);

  // Force a fully opaque frame (transition cut point) without darkening.
  vec3 straight = result.rgb / max(result.a, 1e-4);
  result.a = mix(result.a, 1.0, uFill);
  result.rgb = mix(result.rgb, straight, uFill);

  gl_FragColor = result;
}
`;

import {
  hashGlsl,
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../../helpers/shader/glsl/noise";

/**
 * Crackling electric arcs running down both safe-area edges: several
 * fBm-displaced filaments per side with a white-hot core, colored corona and
 * stepped flicker. Premultiplied RGBA over transparency.
 */
export const plasmaEdgeArcFragmentShader = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uAccent;
uniform float uOpacity;
uniform float uIntensity;
uniform float uDensity;
uniform float uSafeArea;
uniform float uPhase;
uniform float uStep;
uniform float uSeed;

const int MAX_ARCS = 5;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float inset = uSafeArea * 2.0;
  float edgeX = aspect - inset * aspect;
  float yMask = smoothstep(1.0 - inset + 0.02, 1.0 - inset - 0.1, abs(p.y));

  float arcs = clamp(floor(1.0 + uDensity * 2.0), 1.0, float(MAX_ARCS));
  vec3 color = vec3(0.0);
  for (int s = 0; s < 2; s++) {
    float side = float(s) * 2.0 - 1.0;
    for (int k = 0; k < MAX_ARCS; k++) {
      float fk = float(k);
      if (fk >= arcs) break;
      float salt = fk * 7.3 + float(s) * 31.0 + uSeed;
      vec3 lo = loopOffset(uPhase, 1.6, salt);
      float flick = hash12(vec2(uStep, salt));
      float amp = (0.08 + 0.14 * flick) * uIntensity;
      float disp = (fbm3(vec3(p.y * 2.4 + salt, lo.xy), 5) - 0.5) * amp * 2.2
        + (fbm3(vec3(p.y * 11.0, lo.yz * 2.0 + salt), 3) - 0.5) * 0.05 * uIntensity;
      // Arcs bow inward from the edge line.
      float x = side * (edgeX - abs(disp) - fk * 0.012);
      float d = abs(p.x - x);
      float brightness = (0.35 + 0.65 * flick) * yMask;
      float core = exp(-d / 0.0035);
      float corona = exp(-d / 0.028) * 0.5 + exp(-d / 0.14) * 0.14;
      vec3 tint = mod(fk, 2.0) < 1.0 ? uPrimary : uSecondary;
      color += (mix(uAccent, vec3(1.0), 0.55) * core + tint * corona) * brightness * uIntensity;
    }
  }

  color *= uOpacity;
  float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
  gl_FragColor = vec4(min(color, vec3(alpha)), alpha);
}
`;

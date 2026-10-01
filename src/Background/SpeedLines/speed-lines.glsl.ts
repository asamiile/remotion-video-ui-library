import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Technique: atan (polar angle) + hash.
 * The angle around the center is split into sectors; each sector gets a
 * random line that is re-rolled every step, giving manga-style focus lines.
 */
export const speedLinesGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

void main() {
  vec2 p = centered();
  float r = length(p);
  float angle = atan(p.y, p.x);

  float sectors = floor(90.0 * uScale);
  float s = (angle / TAU + 0.5) * sectors;
  float id = floor(s);
  float f = fract(s);

  float on = step(0.35, hash12(vec2(id, uStep + uSeed)));
  float inner = mix(0.35, 0.75, hash12(vec2(id + 3.0, uStep + 1.0)));
  // Lines taper to a point toward the center.
  float width = mix(0.08, 0.45, hash12(vec2(id + 7.0, uStep))) * smoothstep(inner, 1.8, r);
  float line = on * (1.0 - smoothstep(width * 0.5, width, abs(f - 0.5)));
  float radial = smoothstep(inner, inner + 0.3, r);

  float alpha = line * radial * uIntensity;
  vec3 color = mix(uColorA, uColorB, hash12(vec2(id, uSeed))) * alpha;

  emit(color, alpha);
}
`;

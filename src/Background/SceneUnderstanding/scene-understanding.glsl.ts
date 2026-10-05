import { hashGlsl } from "../../helpers/shader/glsl/noise";
import { streetSceneGlsl } from "../../helpers/shader/glsl/street-scene";

/**
 * The street rendered through a perception stack's output passes.
 *
 * Pixels left of uSplit show uModeA (the incoming pass), the rest show
 * uModeB (the outgoing one). Modes: 0 camera, 1 detection, 2 segmentation,
 * 3 depth, 4 normals, 5 edges.
 */
export const sceneUnderstandingGlsl = /* glsl */ `
${hashGlsl}
${streetSceneGlsl}

uniform float uModeA;
uniform float uModeB;
uniform float uSplit;
uniform vec3 uLine;

// Near = bright; a magma-like ramp.
vec3 depthColor(float x) {
  x = clamp(x, 0.0, 1.0);
  vec3 c0 = vec3(0.0, 0.0, 0.02);
  vec3 c1 = vec3(0.32, 0.07, 0.43);
  vec3 c2 = vec3(0.87, 0.29, 0.29);
  vec3 c3 = vec3(0.99, 0.93, 0.68);
  if (x < 0.33) return mix(c0, c1, x / 0.33);
  if (x < 0.66) return mix(c1, c2, (x - 0.33) / 0.33);
  return mix(c2, c3, (x - 0.66) / 0.34);
}

void main() {
  vec3 ro, rd;
  sceneCamera(ro, rd);
  float mode = vUv.x < uSplit ? uModeA : uModeB;
  float boxes = mode == 1.0 ? 1.0 : 0.0;
  vec2 hit = sceneRaycast(ro, rd, 160.0, boxes);
  float t = hit.x;
  float id = hit.y;
  vec3 p = ro + rd * t;
  vec3 n = id == ID_SKY ? -rd : sceneNormal(p, boxes);

  // Derivatives for the edge map, taken before any mode branching.
  float depthEdge = smoothstep(0.03, 0.08, fwidth(t) / max(t, 1.0));
  float normalEdge = smoothstep(0.35, 0.7, length(fwidth(n)));
  float idEdge = step(0.01, fwidth(id));

  vec3 col;
  if (mode == 0.0) {
    col = shadeCamera(rd, p, n, t, id);
  } else if (mode == 1.0) {
    if (id == ID_BOX) {
      col = uLine;
    } else {
      col = shadeCamera(rd, p, n, t, id) * 0.62;
      if (id == ID_CAR) col = mix(col, uLine, 0.12);
    }
  } else if (mode == 2.0) {
    float diff = max(dot(n, normalize(SUN)), 0.0);
    col = segmentColor(id) * (id == ID_SKY ? 1.0 : 0.82 + 0.18 * diff);
    col = mix(col, vec3(1.0), idEdge * 0.35);
  } else if (mode == 3.0) {
    col = id == ID_SKY ? vec3(0.0) : depthColor(1.0 - pow(clamp(t / 90.0, 0.0, 1.0), 0.6));
  } else if (mode == 4.0) {
    col = id == ID_SKY ? vec3(0.0) : n * 0.5 + 0.5;
  } else {
    float line = max(max(depthEdge, normalEdge), idEdge);
    col = uLine * line + uLine * 0.04 * (id == ID_SKY ? 0.0 : 1.0);
  }

  // Wipe divider.
  if (uSplit > 0.0 && uSplit < 1.0) {
    float px = abs(vUv.x - uSplit) * uResolution.x;
    col = mix(col, vec3(1.0), 1.0 - smoothstep(1.0, 2.5, px));
    col += uLine * exp(-px * 0.08) * 0.35;
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

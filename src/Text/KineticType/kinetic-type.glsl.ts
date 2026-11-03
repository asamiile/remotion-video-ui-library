/**
 * Text texture: two rows, the main word on top and the sub word below, each
 * followed by a separator. Red = fill coverage, green = outline coverage, on
 * opaque black. Each row repeats at its own tile width (`uTileWidths`).
 *
 * Styles: 0 wave, 1 tunnel, 2 sphere, 3 stack, 4 fold, 5 ribbons, 6 liquid,
 * 7 boxTunnel, 8 cloth (KINETIC_TYPE_STYLES order).
 * Row modes: 0 = filled / outlined rows alternate; 1 = filled, colored in
 * pairs of rows; 2 = filled bands with dark text alternate with outlined text;
 * 3 = every row filled.
 * Split modes: 0 = radial RGB; 1 = sideways RGB; 2 = sideways red / cyan.
 * Row fill: share of each row the ink takes up; 0 keeps the texture's own
 * spacing.
 */
export const kineticTypeGlsl = /* glsl */ `
uniform sampler2D uText;
uniform vec2 uTextSize;
uniform float uTextReady;
uniform vec2 uTileWidths;
uniform vec2 uWordWidths;
uniform float uRowHeight;
uniform float uInkFraction;
uniform float uRowFill;
uniform float uStyle;
uniform float uRowMode;
uniform float uScroll;
uniform float uSplitMode;
uniform float uPhase;
uniform float uCycles;
uniform float uRows;
uniform float uDistortion;
uniform float uAberration;
uniform float uGlitch;
uniform float uGrain;
uniform float uSeed;
uniform vec3 uTextColor;
uniform vec3 uAccentColor;
uniform vec4 uBg;

const float TAU = 6.28318530718;

float hash11(float n) {
  return fract(sin(n * 127.1 + uSeed * 311.7) * 43758.5453);
}

float hash12(vec2 p) {
  p = mod(p, 1024.0);
  return fract(sin(dot(p, vec2(12.9898, 78.233)) + uSeed) * 43758.5453);
}

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

// One texture row. tile.x in tile widths (repeats), tile.y 0-1 from the row
// top. Gradients are passed in so jumps in the coordinates (row offsets,
// atan seams, tile wraps) don't pick a blurry mip level.
vec4 texRow(float word, vec2 tile, vec2 dx, vec2 dy) {
  float sx = (word < 0.5 ? uTileWidths.x : uTileWidths.y) / uTextSize.x;
  float sy = uRowHeight / uTextSize.y;
  vec2 tuv = vec2(fract(tile.x) * sx, 1.0 - (word + clamp(tile.y, 0.0, 1.0)) * sy);
  return textureGrad(uText, tuv, vec2(dx.x * sx, -dx.y * sy), vec2(dy.x * sx, -dy.y * sy));
}

float rowWord(float row) {
  if (uRowMode > 0.5 && uRowMode < 1.5) return mod(floor(row / 2.0), 2.0);
  return mod(row, 2.0) < 0.5 ? 0.0 : 1.0;
}

float tileAspect(float word) {
  return (word < 0.5 ? uTileWidths.x : uTileWidths.y) / uRowHeight;
}

// A row of text, premultiplied. x in tile widths, y 0-1 from the row top.
vec4 cellTiles(float row, float x, float y, vec2 dx, vec2 dy) {
  bool even = mod(row, 2.0) < 0.5;
  float word = rowWord(row);
  bool fill = even;
  vec3 col = even ? uTextColor : uAccentColor;
  float band = 0.0;
  if (uRowMode > 0.5 && uRowMode < 1.5) {
    fill = true;
    col = word < 0.5 ? uTextColor : uAccentColor;
  } else if (uRowMode > 1.5 && uRowMode < 2.5) {
    col = even ? uAccentColor : uTextColor;
    band = even ? 1.0 : 0.0;
  } else if (uRowMode > 2.5) {
    fill = true;
    col = uTextColor;
  }
  float dir = even ? 1.0 : -1.0;
  float xs = x + dir * uPhase * uCycles * uScroll + hash11(row) * 7.0;
  float tight = uRowFill > 0.0 ? uInkFraction / uRowFill : 1.0;
  vec4 t = texRow(word, vec2(xs, 0.5 + (y - 0.5) * tight), vec2(dx.x, dx.y * tight), vec2(dy.x, dy.y * tight));
  float inside = step(0.0, y) * step(y, 1.0);
  float a = (fill ? t.r : t.g) * inside;
  float b = band * inside;
  return vec4(col * a, a) + vec4(uTextColor * b, b) * (1.0 - a);
}

// Same, with x in row heights so each word keeps its own proportions.
vec4 cellRows(float row, float x, float y, vec2 dx, vec2 dy) {
  float asp = tileAspect(rowWord(row));
  return cellTiles(row, x / asp, y, vec2(dx.x / asp, dx.y), vec2(dy.x / asp, dy.y));
}

// Gradient of an atan angle without the jump at its seam: the same angle
// measured from the opposite side has its seam elsewhere.
float angleGrad(float a, float aOpposite, bool horizontal) {
  float d = horizontal ? dFdx(a) : dFdy(a);
  float dAlt = horizontal ? dFdx(aOpposite) : dFdy(aOpposite);
  return abs(d) < abs(dAlt) ? d : dAlt;
}

// Ray from the camera at the origin through screen point p (y down, focal 1)
// hitting a plane through (0, 0, dist) oriented by R. Returns (u, v, t).
vec3 planeHit(vec2 p, mat3 R, float dist) {
  vec3 d = vec3(p, 1.0);
  vec3 n = R * vec3(0.0, 0.0, 1.0);
  vec3 o = vec3(0.0, 0.0, dist);
  float t = dot(o, n) / dot(d, n);
  vec3 hit = d * t - o;
  return vec3(dot(hit, R * vec3(1.0, 0.0, 0.0)), dot(hit, R * vec3(0.0, 1.0, 0.0)), t);
}

vec4 waveLayer(vec2 p) {
  float ph = TAU * uPhase * uCycles;
  vec2 st = p * uRows;
  float w = st.x * 0.32 + ph;
  st.y += uDistortion * 0.9 * sin(w);
  st.x += uDistortion * 0.5 * sin(st.y * 0.45 - ph);
  float shade = 0.72 + 0.28 * cos(w);
  st.y += uRows * 0.5;
  return cellRows(floor(st.y), st.x, fract(st.y), dFdx(st), dFdy(st)) * shade;
}

vec4 tunnelLayer(vec2 p) {
  float r = max(length(p), 1e-3);
  float ph = TAU * uPhase;
  float depth = 0.32 / r;
  float twist = uDistortion * 0.04 * sin(depth * 0.9 - ph * uCycles);
  float a = atan(p.y, p.x) / TAU + twist;
  float aOpposite = atan(-p.y, -p.x) / TAU + twist;
  // Fly forward 8 rows (an even count, so row parity is kept) per cycle.
  float v = depth * uRows * 0.22 + uPhase * uCycles * 8.0;
  vec2 dx = vec2(angleGrad(a, aOpposite, true) * 3.0, dFdx(v));
  vec2 dy = vec2(angleGrad(a, aOpposite, false) * 3.0, dFdy(v));
  vec4 c = cellTiles(floor(v), a * 3.0, fract(v), dx, dy);
  return c * smoothstep(0.02, 0.45, r);
}

vec4 sphereSide(vec2 p, float side) {
  float z = sqrt(max(0.0, 1.0 - dot(p, p))) * side;
  vec3 n = vec3(p, z);
  float tilt = uDistortion * 0.35;
  n.yz = mat2(cos(tilt), -sin(tilt), sin(tilt), cos(tilt)) * n.yz;
  float spin = TAU * uPhase * uCycles;
  n.xz = mat2(cos(spin), -sin(spin), sin(spin), cos(spin)) * n.xz;
  float lon = atan(n.x, n.z) / TAU;
  float lonOpposite = atan(-n.x, -n.z) / TAU;
  float v = acos(clamp(n.y, -0.999, 0.999)) / 3.14159265 * uRows;
  vec2 dx = vec2(angleGrad(lon, lonOpposite, true) * 3.0, dFdx(v));
  vec2 dy = vec2(angleGrad(lon, lonOpposite, false) * 3.0, dFdy(v));
  vec4 c = cellTiles(floor(v), lon * 3.0, fract(v), dx, dy);
  return c * (side > 0.0 ? 0.55 + 0.45 * abs(z) : 0.3);
}

vec4 sphereLayer(vec2 p) {
  vec2 bgSt = p * uRows * 0.9 + vec2(0.0, 0.5);
  vec4 behind = cellRows(floor(bgSt.y), bgSt.x, fract(bgSt.y), dFdx(bgSt), dFdy(bgSt)) * 0.12;
  // No early return outside the sphere: derivatives need uniform control flow.
  vec2 q = p * 2.7;
  float inside = 1.0 - smoothstep(0.995, 1.0, dot(q, q));
  vec4 back = sphereSide(q, -1.0);
  vec4 front = sphereSide(q, 1.0);
  vec4 shell = (front + back * (1.0 - front.a)) * inside;
  return shell + behind * (1.0 - shell.a);
}

// One copy of the main word per row, fitted to the frame width, rows stacked
// at the ink height. Letters lean back and forth in a wave travelling along
// each row (opposite directions on alternate rows) and bob slightly.
vec4 stackLayer(vec2 uv) {
  const float MARGIN = 0.03;
  const float ROW_GAP = 1.06;
  vec2 px = vec2(uv.x, 1.0 - uv.y) * uResolution;
  float texPx = (1.0 - 2.0 * MARGIN) * uResolution.x / uWordWidths.x;
  float pitch = uRowHeight * uInkFraction * ROW_GAP * texPx;
  float yRel = (px.y - 0.5 * uResolution.y) / pitch + 0.5;
  float ph = TAU * uPhase * uCycles;
  float xn = px.x / uResolution.x;
  // The bob is the same for every row so the row a pixel falls in is unambiguous.
  float bob = uDistortion * 0.06 * sin(xn * TAU + ph);
  float row = floor(yRel - bob);
  bool even = mod(row, 2.0) < 0.5;
  float dir = even ? 1.0 : -1.0;
  float lean = uDistortion * 0.22 * sin(xn * TAU * 1.5 - ph * dir + row * 1.7);

  // Continuous (row-independent) coordinates give the mip gradients.
  float yCont = yRel - 0.5 - bob;
  float yIn = yCont - row;
  float toTile = 1.0 / (texPx * uTileWidths.x);
  float u = (px.x - MARGIN * uResolution.x + lean * yIn * pitch) * toTile;
  float uCont = (px.x - MARGIN * uResolution.x + lean * yCont * pitch) * toTile;
  float y = 0.5 + yIn * uInkFraction * ROW_GAP;
  float yContRow = 0.5 + yCont * uInkFraction * ROW_GAP;
  vec4 t = texRow(0.0, vec2(u, y), vec2(dFdx(uCont), dFdx(yContRow)), vec2(dFdy(uCont), dFdy(yContRow)));

  float inside = step(0.0, u) * step(u, uWordWidths.x / uTileWidths.x) * step(abs(yIn), 0.5);
  float a = (even ? t.r : t.g) * inside;
  float sheen = 0.82 + 0.18 * sin(px.y * 0.02 + xn * 4.0 + ph);
  vec3 col = even ? uTextColor * sheen : uAccentColor;
  return vec4(col * a, a);
}

// Two walls meeting in an inside corner (the crease is the farthest point),
// rows running across both. The crease sways and the walls open and close.
vec4 foldLayer(vec2 p) {
  float ph = TAU * uPhase;
  vec3 d = vec3(p, 1.0);
  vec3 C = vec3(0.45 + 0.08 * sin(ph), 0.0, 2.4);
  float al = uDistortion * 0.75 + 0.08 * sin(ph);
  float ar = uDistortion * 1.1 - 0.08 * sin(ph);
  vec3 wl = vec3(-cos(al), 0.0, -sin(al));
  vec3 nl = vec3(sin(al), 0.0, -cos(al));
  vec3 wr = vec3(cos(ar), 0.0, -sin(ar));
  vec3 nr = vec3(sin(ar), 0.0, cos(ar));
  float tl = dot(C, nl) / dot(d, nl);
  float sl = dot(d * tl - C, wl);
  float tr = dot(C, nr) / dot(d, nr);
  float sr = dot(d * tr - C, wr);
  float hitL = (tl > 0.0 && sl >= 0.0) ? tl : 1e9;
  float hitR = (tr > 0.0 && sr >= 0.0) ? tr : 1e9;
  bool left = hitL < hitR;
  float t = left ? tl : tr;
  float u = left ? -sl : sr;
  float rowH = C.z / uRows;
  vec2 st = vec2(u, d.y * t) / rowH + vec2(0.0, uRows * 0.5);
  float shade = 0.72 + 0.28 * smoothstep(0.0, 1.6, abs(u));
  vec4 c = cellRows(floor(st.y), st.x, fract(st.y), dFdx(st), dFdy(st));
  return c * shade * step(min(hitL, hitR), 1e8);
}

// A tilted plane of strips receding toward the upper right.
vec4 ribbonsLayer(vec2 p) {
  float ph = TAU * uPhase;
  mat3 R = rotY(0.55 + uDistortion * 0.06 * sin(ph)) * rotX(-0.15) * rotZ(-0.42);
  vec3 h = planeHit(p, R, 2.0);
  vec2 st = h.xy / (2.0 / uRows);
  float fog = exp(-max(h.z - 2.0, 0.0) * 0.12);
  vec4 c = cellRows(floor(st.y), st.x, fract(st.y), dFdx(st), dFdy(st));
  return c * fog * step(0.0, h.z);
}

vec3 echoColor(int i) {
  if (i < 2) return vec3(0.93, 0.2, 0.15);
  if (i == 2) return vec3(0.3, 0.95, 1.0);
  if (i == 3) return vec3(1.0, 0.9, 0.2);
  if (i == 4) return vec3(0.15, 0.25, 1.0);
  return vec3(1.0, 0.3, 0.9);
}

float echoOffset(int i) {
  if (i == 0) return -1.0;
  if (i == 1) return 1.0;
  if (i == 2) return -0.6;
  if (i == 3) return 0.6;
  if (i == 4) return -0.3;
  return 0.3;
}

// The main word, centered, with colored echoes smearing sideways over a
// barrel-distorted grid that bulges in and out.
vec4 liquidLayer(vec2 p) {
  float ph = TAU * uPhase * uCycles;
  float k = uDistortion * (0.35 + 0.2 * sin(ph));
  vec2 q = p * (1.0 + k * dot(p, p)) * uRows;
  vec2 fw = fwidth(q);
  vec2 lines = 1.0 - smoothstep(fw * 0.6, fw * 1.8, 0.5 - abs(fract(q) - 0.5));
  float grid = max(lines.x, lines.y) * 0.85;
  vec4 c = vec4(uAccentColor * grid, grid);

  float aspect = uResolution.x / uResolution.y;
  float wordAsp = uWordWidths.x / uRowHeight;
  float asp = tileAspect(0.0);
  vec2 tp = p / (0.52 * aspect / wordAsp) + vec2(wordAsp * 0.5, 0.5);
  tp.x += uDistortion * 0.08 * sin(tp.y * 6.0 + ph);
  vec2 dx = vec2(dFdx(tp.x) / asp, dFdx(tp.y));
  vec2 dy = vec2(dFdy(tp.x) / asp, dFdy(tp.y));
  float spread = uDistortion * 0.22 * (0.55 + 0.45 * sin(ph));
  for (int i = 0; i < 7; i++) {
    float off = i < 6 ? echoOffset(i) * spread * (0.8 + 0.2 * sin(ph + float(i))) : 0.0;
    float x = tp.x + off;
    vec4 t = texRow(0.0, vec2(x / asp, tp.y), dx, dy);
    float inside = step(0.0, x) * step(x, wordAsp) * step(0.0, tp.y) * step(tp.y, 1.0);
    float a = t.r * inside;
    vec3 col = i < 6 ? echoColor(i) : uTextColor;
    c = vec4(col * a, a) + c * (1.0 - a);
  }
  return c;
}

// Square tunnel, two bands per wall, text running along the walls toward
// the vanishing point while the camera flies forward.
vec4 boxTunnelLayer(vec2 p) {
  float ph = TAU * uPhase;
  float roll = uDistortion * 0.12 * sin(ph);
  p = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * p;
  float ax = abs(p.x);
  float ay = abs(p.y);
  float r = max(max(ax, ay), 1e-3);
  float depth = 0.5 / r;
  bool sideWall = ax > ay;
  float wall = sideWall ? (p.x > 0.0 ? 1.0 : 3.0) : (p.y > 0.0 ? 2.0 : 0.0);
  float across = ((sideWall ? p.y : p.x) / r + 1.0);
  float row = wall * 2.0 + floor(across);
  float y = fract(across);
  float asp = tileAspect(rowWord(row));
  // Fly forward three tiles per cycle (whole tiles keep the loop seamless).
  float x = depth * 2.0 / asp - uPhase * uCycles * 3.0;
  vec2 dx = vec2(dFdx(depth) * 2.0 / asp, dFdx(across));
  vec2 dy = vec2(dFdy(depth) * 2.0 / asp, dFdy(across));
  vec4 c = cellTiles(row, x, y, dx, dy);
  float shade = sideWall ? 0.92 : 1.0;
  return c * shade * smoothstep(0.03, 0.32, r);
}

// Dense rows on a waving sheet seen in perspective; the corners away from a
// diagonal focus band are blurred.
vec4 clothLayer(vec2 p) {
  float ph = TAU * uPhase * uCycles;
  mat3 R = rotY(-0.3) * rotX(0.62) * rotZ(-0.36);
  vec3 h = planeHit(p, R, 2.0);
  vec2 q = h.xy / (2.0 / uRows);
  float w = q.x * 0.22 + q.y * 0.1 + ph;
  float wave = sin(w) * cos(q.y * 0.17 - ph);
  q.y += uDistortion * 1.6 * wave;
  q.x += uDistortion * 0.8 * wave;
  float shade = 0.5 + 0.5 * (0.5 + 0.5 * cos(w));
  float blur = smoothstep(0.12, 0.55, abs(dot(p, vec2(0.7071, 0.7071))));
  vec2 dx = dFdx(q) * (1.0 + blur * 7.0);
  vec2 dy = dFdy(q) * (1.0 + blur * 7.0);
  float fog = exp(-max(h.z - 2.0, 0.0) * 0.08);
  vec4 c = cellRows(floor(q.y), q.x, fract(q.y), dx, dy);
  return c * shade * fog * step(0.0, h.z);
}

vec4 scene(vec2 uv) {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  p.y = -p.y;
  if (uStyle < 0.5) return waveLayer(p);
  if (uStyle < 1.5) return tunnelLayer(p);
  if (uStyle < 2.5) return sphereLayer(p);
  if (uStyle < 3.5) return stackLayer(uv);
  if (uStyle < 4.5) return foldLayer(p);
  if (uStyle < 5.5) return ribbonsLayer(p);
  if (uStyle < 6.5) return liquidLayer(p);
  if (uStyle < 7.5) return boxTunnelLayer(p);
  return clothLayer(p);
}

void main() {
  vec2 uv = vUv;

  // Short horizontal tears on random frames.
  float tick = floor(uFrame / 2.0);
  float tearing = step(hash11(tick + 17.0), uGlitch * 0.25);
  float bandY = hash11(tick + 3.0);
  float bandH = 0.03 + 0.12 * hash11(tick + 5.0);
  float inBand = tearing * step(abs(uv.y - bandY), bandH);
  uv.x += inBand * (hash11(tick + 9.0) - 0.5) * 0.12;

  // Radial split, or a sideways one that jitters every other frame.
  vec2 off = uSplitMode < 0.5
    ? (uv - 0.5) * uAberration * 0.014
    : vec2(uAberration * 0.0035 * (0.7 + 0.6 * hash11(tick + 21.0)), 0.0);
  off.x += inBand * 0.01;
  vec4 cr = scene(uv + off);
  vec4 cg = scene(uv);
  vec4 cb = scene(uv - off);
  vec4 c = uSplitMode > 1.5
    ? vec4(cr.r, cb.g, cb.b, max(cr.a, cb.a))
    : vec4(cr.r, cg.g, cb.b, max(cg.a, max(cr.a, cb.a)));
  c *= uTextReady;

  float bgA = uBg.a * (1.0 - c.a);
  vec4 outColor = vec4(c.rgb + uBg.rgb * bgA, c.a + bgA);

  // Film grain plus faint vertical streaks, kept within the drawn alpha.
  float grain = hash12(floor(vUv * uResolution) + vec2(uFrame * 17.0, uFrame * 31.0)) - 0.5;
  float streak = hash11(floor(vUv.x * uResolution.x / 3.0) + 101.0) - 0.5;
  outColor.rgb = max(outColor.rgb + (grain * 0.09 + streak * 0.035) * uGrain * outColor.a, 0.0);
  gl_FragColor = outColor;
}
`;

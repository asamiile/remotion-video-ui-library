import * as THREE from "three";

/** CSS color → sRGB [r, g, b] (0-1), bypassing three.js linear color management. */
export function cssColorToVec3(cssColor: string): [number, number, number] {
  const color = new THREE.Color();
  color.setStyle(cssColor, THREE.SRGBColorSpace);
  const { r, g, b } = color.getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace);
  return [r, g, b];
}

/** Like `cssColorToVec3`, with alpha 0 for `transparent` and 1 otherwise. */
export function cssColorToVec4(
  cssColor: string,
): [number, number, number, number] {
  if (cssColor.trim().toLowerCase() === "transparent") return [0, 0, 0, 0];
  return [...cssColorToVec3(cssColor), 1];
}

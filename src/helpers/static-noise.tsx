import React, { useLayoutEffect, useRef } from "react";

const NOISE_W = 320;
const NOISE_H = 180;

/** Small fast PRNG so a full noise frame stays cheap; seeded per frame. */
export const mulberry32 = (a: number) => () => {
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Low-res TV snow with per-row brightness bands, redrawn every frame and
 * stretched to its container. `tint` (0-1 RGB) colors it, e.g. green phosphor.
 */
export const StaticNoise: React.FC<{
  seed: number;
  frame: number;
  tint?: readonly [number, number, number];
}> = ({ seed, frame, tint = [1, 1, 1] }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [tr, tg, tb] = tint;
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    const rand = mulberry32(seed * 7919 + frame * 104729);
    const img = ctx.createImageData(NOISE_W, NOISE_H);
    const bandY = rand() * NOISE_H;
    for (let y = 0; y < NOISE_H; y++) {
      const band = Math.abs(y - bandY) < 14 ? 1.25 : 1;
      const row = (0.7 + rand() * 0.3) * band;
      for (let x = 0; x < NOISE_W; x++) {
        const v = Math.min(255, rand() * 255 * row);
        const i = (y * NOISE_W + x) * 4;
        img.data[i] = v * tr;
        img.data[i + 1] = v * tg;
        img.data[i + 2] = v * tb;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [seed, frame, tr, tg, tb]);
  return (
    <canvas
      ref={ref}
      width={NOISE_W}
      height={NOISE_H}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};

export const GARBLE_POOL = "0123456789.-▯∞";

import { random } from "remotion";

/** Replaces characters of `text` with pseudo-random noise glyphs at `seed`-derived positions, at roughly `rate` probability per non-whitespace character. */
export function garbleChars(text: string, seed: string, rate: number): string {
  return Array.from(text)
    .map((ch, i) => {
      if (/\s/.test(ch)) {
        return ch;
      }
      if (random(`${seed}-gr-${i}`) < rate) {
        return GARBLE_POOL[
          Math.floor(random(`${seed}-gp-${i}`) * GARBLE_POOL.length)
        ];
      }
      return ch;
    })
    .join("");
}

export const GARBLE_POOL = "0123456789.-▯∞";
/** Letters, digits, and symbols, as used by GlitchTextRandom's harsh-signal look */
export const GARBLE_POOL_ALPHANUMERIC =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-#@*$%▯∞";

import { random } from "remotion";

/** Replaces characters of `text` with pseudo-random noise glyphs at `seed`-derived positions, at roughly `rate` probability per non-whitespace character. */
export function garbleChars(
  text: string,
  seed: string,
  rate: number,
  pool: string = GARBLE_POOL,
): string {
  return Array.from(text)
    .map((ch, i) => {
      if (/\s/.test(ch)) {
        return ch;
      }
      if (random(`${seed}-gr-${i}`) < rate) {
        return pool[Math.floor(random(`${seed}-gp-${i}`) * pool.length)];
      }
      return ch;
    })
    .join("");
}

import { continueRender, delayRender } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/LINESeedJP";

/** Font stack used for Japanese text in Studio / renders (LINE Seed JP) */
export const LINE_SEED_JP_FONT_FAMILY = `'${fontFamily}', sans-serif`;

// LINE Seed JP's chunk keys are numeric ([0]...), so subset names like `japanese` don't work here.
// Specifying only weights loads every chunk for each weight, which includes hiragana and kanji.
const lineSeed = loadFont("normal", {
  weights: ["400", "700"],
  ignoreTooManyRequestsWarning: true,
});

const handle = delayRender("LINE Seed JP");

void lineSeed.waitUntilDone().then(() => {
  continueRender(handle);
});

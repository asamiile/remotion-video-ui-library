import { continueRender, delayRender } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/LINESeedJP";

/** Studio / レンダで日本語テキストに使うフォントスタック（LINE Seed JP） */
export const LINE_SEED_JP_FONT_FAMILY = `'${fontFamily}', sans-serif`;

// LINE Seed JP はチャンク键が [0]… のため subset 名（japanese 等）は使えない。
// weights のみ指定すると各ウェイトの全チャンクが載り、ひらがな・漢字も含まれる。
const lineSeed = loadFont("normal", {
  weights: ["400", "700"],
});

const handle = delayRender("LINE Seed JP");

void lineSeed.waitUntilDone().then(() => {
  continueRender(handle);
});

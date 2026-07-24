import { continueRender, delayRender } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/SpaceGrotesk";

/** OneTakeブランドの見出し用フォント（asami.tokyo LPの`--font-sans`と同じSpace Grotesk） */
export const SPACE_GROTESK_FONT_FAMILY = `'${fontFamily}', ui-sans-serif, sans-serif`;

const spaceGrotesk = loadFont("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

const handle = delayRender("Space Grotesk");

void spaceGrotesk.waitUntilDone().then(() => {
  continueRender(handle);
});

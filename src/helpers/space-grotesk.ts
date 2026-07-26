import { continueRender, delayRender } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/SpaceGrotesk";

/** Heading font for the OneTake brand (same Space Grotesk as asami.tokyo LP's `--font-sans`) */
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

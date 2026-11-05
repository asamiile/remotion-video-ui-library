import { continueRender, delayRender } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Oswald";

/** Condensed bold sans for tall, tightly packed display type (kinetic typography) */
export const OSWALD_FONT_FAMILY = `'${fontFamily}', ui-sans-serif, sans-serif`;

const oswald = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

const handle = delayRender("Oswald");

void oswald.waitUntilDone().then(() => {
  continueRender(handle);
});

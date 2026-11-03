import { continueRender, delayRender } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Montserrat";

/** Wide geometric sans for heavy display type (kinetic typography) */
export const MONTSERRAT_FONT_FAMILY = `'${fontFamily}', ui-sans-serif, sans-serif`;

const montserrat = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

const handle = delayRender("Montserrat");

void montserrat.waitUntilDone().then(() => {
  continueRender(handle);
});

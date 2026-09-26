import { continueRender, delayRender } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/JetBrainsMono";

/** Monospace for code/typewriter use (JetBrains Mono) */
export const JETBRAINS_MONO_FONT_FAMILY = `'${fontFamily}', ui-monospace, monospace`;

const jb = loadFont("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  ignoreTooManyRequestsWarning: true,
});

const handle = delayRender("JetBrains Mono");

void jb.waitUntilDone().then(() => {
  continueRender(handle);
});

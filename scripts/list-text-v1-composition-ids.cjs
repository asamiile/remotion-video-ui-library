// Text-effect composition IDs (uses the same capPattern as Root.tsx). Enumerated from each *-config.ts.
// composition-text.local.json only overrides copy — it's not the source of truth for IDs.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const families = [
  {
    idPrefix: "LedTextV1",
    file: "src/Text/LedText/LedText-v1/led-text-config.ts",
    exportName: "ledTextV1Patterns",
  },
  {
    idPrefix: "NeonTextV1",
    file: "src/Text/NeonText/NeonText-v1/neon-text-config.ts",
    exportName: "neonTextV1Patterns",
  },
  {
    idPrefix: "SlideInCaptionV1",
    file: "src/Text/SlideInCaption/SlideInCaption-v1/slide-in-caption-config.ts",
    exportName: "slideInCaptionV1Patterns",
  },
  {
    idPrefix: "GlitchTextV1",
    file: "src/Text/GlitchText/GlitchText-v1/glitch-text-config.ts",
    exportName: "glitchTextV1Patterns",
  },
  {
    idPrefix: "WireTextV1",
    file: "src/Text/WireText/WireText-v1/wire-text-config.ts",
    exportName: "wireTextV1Patterns",
  },
  {
    idPrefix: "NeonTextV1-Rainbow",
    file: "src/Text/NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-config.ts",
    exportName: "neonTextRainbowV1Patterns",
    join: "",
  },
  {
    idPrefix: "LightSweepTextV1",
    file: "src/Text/LightSweepText/LightSweepText-v1/light-sweep-text-config.ts",
    exportName: "lightSweepTextV1Patterns",
  },
  {
    idPrefix: "TypewriterTextV1",
    file: "src/Text/TypewriterText/TypewriterText-v1/typewriter-text-config.ts",
    exportName: "typewriterTextV1Patterns",
  },
  {
    idPrefix: "ShakeTextV1",
    file: "src/Text/ShakeText/ShakeText-v1/shake-text-config.ts",
    exportName: "shakeTextV1Patterns",
  },
  {
    idPrefix: "ConfettiPopTextV1",
    file: "src/Text/ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-config.ts",
    exportName: "confettiPopTextV1Patterns",
  },
  {
    idPrefix: "StackedRevealTextV1",
    file: "src/Text/StackedRevealText/StackedRevealText-v1/stacked-reveal-text-config.ts",
    exportName: "stackedRevealTextV1Patterns",
  },
  {
    idPrefix: "TornNoteCaptionV1",
    file: "src/Text/TornNoteCaption/TornNoteCaption-v1/torn-note-caption-config.ts",
    exportName: "tornNoteCaptionV1Patterns",
  },
  {
    idPrefix: "DistressedTitleCardV1",
    file: "src/Text/DistressedTitleCard/DistressedTitleCard-v1/distressed-title-card-config.ts",
    exportName: "distressedTitleCardV1Patterns",
  },
  {
    idPrefix: "SprayPaintTextV1",
    file: "src/Text/SprayPaintText/SprayPaintText-v1/spray-paint-text-config.ts",
    exportName: "sprayPaintTextV1Patterns",
  },
];

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  const sep = fam.join === "" ? "" : "-";
  for (const patternId of keys) {
    process.stdout.write(`${fam.idPrefix}${sep}${capPattern(patternId)}\n`);
  }
}

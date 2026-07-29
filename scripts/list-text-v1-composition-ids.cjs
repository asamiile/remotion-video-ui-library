// Text-effect composition IDs (uses the same capPattern as Root.tsx). Enumerated from each schema.ts.
// composition-text.local.json only overrides copy — it's not the source of truth for IDs.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const families = [
  {
    idPrefix: "LedTextV1",
    file: "src/Text/LedText/led-text.schema.ts",
    exportName: "ledTextPatterns",
  },
  {
    idPrefix: "NeonTextV1",
    file: "src/Text/NeonText/neon-text.schema.ts",
    exportName: "neonTextPatterns",
  },
  {
    idPrefix: "SlideInCaptionV1",
    file: "src/Text/SlideInCaption/slide-in-caption.schema.ts",
    exportName: "slideInCaptionPatterns",
  },
  {
    idPrefix: "GlitchTextV1",
    file: "src/Text/GlitchText/glitch-text.schema.ts",
    exportName: "glitchTextPatterns",
  },
  {
    idPrefix: "WireTextV1",
    file: "src/Text/WireText/wire-text.schema.ts",
    exportName: "wireTextPatterns",
  },
  {
    idPrefix: "NeonTextV1-Rainbow",
    file: "src/Text/NeonTextRainbow/neon-text-rainbow.schema.ts",
    exportName: "neonTextRainbowPatterns",
    join: "",
  },
  {
    idPrefix: "LightSweepTextV1",
    file: "src/Text/LightSweepText/light-sweep-text.schema.ts",
    exportName: "lightSweepTextPatterns",
  },
  {
    idPrefix: "DottedLineMarkerTextV1",
    file: "src/Text/DottedLineMarkerText/dotted-line-marker-text.schema.ts",
    exportName: "dottedLineMarkerPatterns",
  },
  {
    idPrefix: "TypewriterTextV1",
    file: "src/Text/TypewriterText/typewriter-text.schema.ts",
    exportName: "typewriterTextPatterns",
  },
  {
    idPrefix: "ShakeTextV1",
    file: "src/Text/ShakeText/shake-text.schema.ts",
    exportName: "shakeTextPatterns",
  },
  {
    idPrefix: "ConfettiPopTextV1",
    file: "src/Text/ConfettiPopText/confetti-pop-text.schema.ts",
    exportName: "confettiPopTextPatterns",
  },
  {
    idPrefix: "CodeStreamV1",
    file: "src/Text/CodeStream/code-stream.schema.ts",
    exportName: "codeStreamPatterns",
  },
  {
    idPrefix: "StackedRevealTextV1",
    file: "src/Text/StackedRevealText/stacked-reveal-text.schema.ts",
    exportName: "stackedRevealTextPatterns",
  },
  {
    idPrefix: "TornNoteCaptionV1",
    file: "src/Text/TornNoteCaption/torn-note-caption.schema.ts",
    exportName: "tornNoteCaptionPatterns",
  },
  {
    idPrefix: "DistressedTitleCardV1",
    file: "src/Text/DistressedTitleCard/distressed-title-card.schema.ts",
    exportName: "distressedTitleCardPatterns",
  },
  {
    idPrefix: "SprayPaintTextV1",
    file: "src/Text/SprayPaintText/spray-paint-text.schema.ts",
    exportName: "sprayPaintTextPatterns",
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

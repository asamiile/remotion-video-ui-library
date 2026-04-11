// テキスト系コンポジション ID（Root.tsx と同じ capPattern）。列挙元は各 *-config.ts。
// composition-text.local.json は文言の上書きであり、ID の正ではない。
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const families = [
  {
    idPrefix: "LedTextV1",
    file: "src/LedText/LedText-v1/led-text-config.ts",
    exportName: "ledTextV1Patterns",
  },
  {
    idPrefix: "NeonTextV1",
    file: "src/NeonText/NeonText-v1/neon-text-config.ts",
    exportName: "neonTextV1Patterns",
  },
  {
    idPrefix: "SlideInCaptionV1",
    file: "src/SlideInCaption/SlideInCaption-v1/slide-in-caption-config.ts",
    exportName: "slideInCaptionV1Patterns",
  },
  {
    idPrefix: "GlitchTextV1",
    file: "src/GlitchText/GlitchText-v1/glitch-text-config.ts",
    exportName: "glitchTextV1Patterns",
  },
  {
    idPrefix: "WireTextV1",
    file: "src/WireText/WireText-v1/wire-text-config.ts",
    exportName: "wireTextV1Patterns",
  },
  {
    idPrefix: "NeonTextV1-Rainbow",
    file: "src/NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-config.ts",
    exportName: "neonTextRainbowV1Patterns",
    join: "",
  },
  {
    idPrefix: "LightSweepTextV1",
    file: "src/LightSweepText/LightSweepText-v1/light-sweep-text-config.ts",
    exportName: "lightSweepTextV1Patterns",
  },
  {
    idPrefix: "TypewriterTextV1",
    file: "src/TypewriterText/TypewriterText-v1/typewriter-text-config.ts",
    exportName: "typewriterTextV1Patterns",
  },
  {
    idPrefix: "ShakeTextV1",
    file: "src/ShakeText/ShakeText-v1/shake-text-config.ts",
    exportName: "shakeTextV1Patterns",
  },
  {
    idPrefix: "ConfettiPopTextV1",
    file: "src/ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-config.ts",
    exportName: "confettiPopTextV1Patterns",
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

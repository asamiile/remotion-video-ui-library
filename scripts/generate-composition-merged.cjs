#!/usr/bin/env node
/**
 * Auto-generates src/composition/composition-merged.ts using AST enumeration.
 *
 * Unlike full auto-generation, this uses a semi-automated approach:
 * 1. Explicit family definitions list (order-controlled) in this script
 * 2. AST parsing to extract pattern keys from *-config.ts files
 * 3. Template generation of imports + exports
 *
 * This prevents ordering issues and makes special cases (intro, locations) easy to handle.
 *
 * Usage: node scripts/generate-composition-merged.cjs > src/composition/composition-merged.ts
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");

// ============================================================================
// Family definitions (order-controlled, matches current composition-merged.ts)
// ============================================================================

const families = [
  // Special: intro
  { type: "intro", file: "Intro/Intro-v1/intro-config", export: "defaultIntroV1Props" },

  // Text compositions (order matches current composition-merged.ts)
  { type: "pattern", file: "Text/LedText/LedText-v1/led-text-config", export: "ledTextV1Patterns" },
  { type: "pattern", file: "Text/NeonText/NeonText-v1/neon-text-config", export: "neonTextV1Patterns" },
  { type: "pattern", file: "Text/SlideInCaption/SlideInCaption-v1/slide-in-caption-config", export: "slideInCaptionV1Patterns" },
  { type: "pattern", file: "Text/GlitchText/GlitchText-v1/glitch-text-config", export: "glitchTextV1Patterns" },
  { type: "pattern", file: "Text/GlitchText/GlitchText-v1/glitch-text-random-config", export: "glitchTextV1RandomPatterns" },
  { type: "pattern", file: "Text/WireText/WireText-v1/wire-text-config", export: "wireTextV1Patterns" },
  { type: "pattern", file: "Text/NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-config", export: "neonTextRainbowV1Patterns" },
  { type: "pattern", file: "Text/LightSweepText/LightSweepText-v1/light-sweep-text-config", export: "lightSweepTextV1Patterns" },
  { type: "pattern", file: "Background/RandomLines/RandomLinesBackground-v1/random-lines-config", export: "randomLinesV1Patterns", localName: "randomLinesBackgroundV1Patterns" },
  { type: "pattern", file: "Text/DottedLineMarkerText/DottedLineMarkerText-v1/dotted-line-marker-text-config", export: "dottedLineMarkerV1Patterns", localName: "dottedLineMarkerTextV1Patterns" },
  { type: "pattern", file: "Text/TypewriterText/TypewriterText-v1/typewriter-text-config", export: "typewriterTextV1Patterns" },
  { type: "pattern", file: "Text/ShakeText/ShakeText-v1/shake-text-config", export: "shakeTextV1Patterns" },
  { type: "pattern", file: "Text/ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-config", export: "confettiPopTextV1Patterns" },
  { type: "pattern", file: "Loading/LoadingIcon-v1/loading-icon-config", export: "loadingIconV1Patterns" },
  { type: "pattern", file: "Text/CodeStream/CodeStream-v1/code-stream-config", export: "codeStreamV1Patterns" },
  { type: "pattern", file: "Text/StackedRevealText/StackedRevealText-v1/stacked-reveal-text-config", export: "stackedRevealTextV1Patterns" },
  { type: "pattern", file: "Text/TornNoteCaption/TornNoteCaption-v1/torn-note-caption-config", export: "tornNoteCaptionV1Patterns" },
  { type: "pattern", file: "Text/DistressedTitleCard/DistressedTitleCard-v1/distressed-title-card-config", export: "distressedTitleCardV1Patterns" },
  { type: "pattern", file: "Text/SprayPaintText/SprayPaintText-v1/spray-paint-text-config", export: "sprayPaintTextV1Patterns" },

  // UI compositions
  { type: "pattern", file: "UI/BattleCalloutBanner/BattleCalloutBanner-v1/battle-callout-banner-config", export: "battleCalloutBannerV1Patterns" },
  { type: "pattern", file: "UI/AsymmetricStatusPanel/AsymmetricStatusPanel-v1/asymmetric-status-panel-config", export: "asymmetricStatusPanelV1Patterns" },

  // Special: oneTakeLogo props
  { type: "oneTakeLogo", file: "Text/FlickerTitle-v1/flicker-title-config", export: "oneTakeLogoTextVariantProps" },
];

// ============================================================================
// Generate output
// ============================================================================

const imports = [];
const exportLines = [];

// Validate and process each family
for (const family of families) {
  const fullPath = path.join(SRC, family.file + ".ts");

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const importPath = `../${family.file}`;

  if (family.type === "intro") {
    imports.push(`import { ${family.export} } from "${importPath}";`);
  } else if (family.type === "pattern") {
    imports.push(`import { ${family.export} } from "${importPath}";`);
  } else if (family.type === "oneTakeLogo") {
    imports.push(`import { ${family.export} } from "${importPath}";`);
  }
}

// Add merge helpers import
imports.push(
  `import {
  buildLocationConfigsFromCompositionKeys,
  buildMapLocationPointsFromCompositionKeys,
  getEffectiveCompositionText,
  getLocationV1CompositionKeys,
  shallowMergePatternRecord,
} from "./merge-composition-local";`,
);

// Local setup
const localSection = [
  "",
  "const local = getEffectiveCompositionText();",
  "const locationV1CompositionKeys = getLocationV1CompositionKeys();",
  "",
];

// Generate exports
for (const family of families) {
  if (family.type === "intro") {
    exportLines.push("export const mergedDefaultIntroV1Props = {");
    exportLines.push("  ...defaultIntroV1Props,");
    exportLines.push("  ...local.intro,");
    exportLines.push("};");
    exportLines.push("");
  } else if (family.type === "pattern") {
    const identifier = family.export.replace(/Patterns$/, "");
    const localName = family.localName || identifier + "Patterns";
    const mergedName = `merged${identifier.charAt(0).toUpperCase() + identifier.slice(1)}Patterns`;

    exportLines.push(
      `export const ${mergedName} = shallowMergePatternRecord(`,
    );
    exportLines.push(`  ${family.export},`);
    exportLines.push(`  local.${localName},`);
    exportLines.push(`) as typeof ${family.export};`);
    exportLines.push("");
  }
}

// Add oneTakeLogo export
exportLines.push("export const mergedOneTakeLogoTextV1Props = {");
exportLines.push("  ...oneTakeLogoTextVariantProps,");
exportLines.push("  ...(local.oneTakeLogoTextV1 || {}),");
exportLines.push("};");
exportLines.push("");

// Location exports
exportLines.push("export const mergedLocationConfigsV1 =");
exportLines.push(
  "  buildLocationConfigsFromCompositionKeys(local, locationV1CompositionKeys);",
);
exportLines.push("");

exportLines.push("export const mergedMapLocationPointsV1 =");
exportLines.push(
  "  buildMapLocationPointsFromCompositionKeys(local, locationV1CompositionKeys);",
);

// Output
const output = [
  ...imports,
  ...localSection,
  ...exportLines,
].join("\n");

process.stdout.write(output + "\n");

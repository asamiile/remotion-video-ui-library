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
  { type: "intro", file: "Intro/Intro/intro.schema", export: "defaultIntroV1Props", category: "other" },

  // Text compositions (order matches current composition-merged.ts)
  { type: "pattern", file: "Text/LedText/led-text.schema", export: "ledTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/NeonText/neon-text.schema", export: "neonTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/SlideInCaption/slide-in-caption.schema", export: "slideInCaptionV1Patterns", category: "text" },
  { type: "pattern", file: "Text/GlitchText/glitch-text.schema", export: "glitchTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/GlitchText/glitch-text-random.schema", export: "glitchTextV1RandomPatterns", category: "text" },
  { type: "pattern", file: "Text/WireText/wire-text.schema", export: "wireTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/NeonTextRainbow/neon-text-rainbow.schema", export: "neonTextRainbowV1Patterns", category: "text" },
  { type: "pattern", file: "Text/LightSweepText/light-sweep-text.schema", export: "lightSweepTextV1Patterns", category: "text" },
  { type: "pattern", file: "Background/RandomLinesBackground/random-lines.schema", export: "randomLinesV1Patterns", localName: "randomLinesBackgroundV1Patterns", category: "background" },
  { type: "pattern", file: "Text/DottedLineMarkerText/dotted-line-marker-text.schema", export: "dottedLineMarkerV1Patterns", localName: "dottedLineMarkerTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/TypewriterText/typewriter-text.schema", export: "typewriterTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/ShakeText/shake-text.schema", export: "shakeTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/ConfettiPopText/confetti-pop-text.schema", export: "confettiPopTextV1Patterns", category: "text" },
  { type: "pattern", file: "Loading/LoadingIcon/loading-icon.schema", export: "loadingIconV1Patterns", category: "other" },
  { type: "pattern", file: "Text/CodeStream/code-stream.schema", export: "codeStreamV1Patterns", category: "text" },
  { type: "pattern", file: "Text/StackedRevealText/stacked-reveal-text.schema", export: "stackedRevealTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/TornNoteCaption/torn-note-caption.schema", export: "tornNoteCaptionV1Patterns", category: "text" },
  { type: "pattern", file: "Text/DistressedTitleCard/distressed-title-card.schema", export: "distressedTitleCardV1Patterns", category: "text" },
  { type: "pattern", file: "Text/SprayPaintText/spray-paint-text.schema", export: "sprayPaintTextV1Patterns", category: "text" },

  // UI compositions
  { type: "pattern", file: "UI/BattleCalloutBanner/battle-callout-banner.schema", export: "battleCalloutBannerV1Patterns", category: "ui" },
  { type: "pattern", file: "UI/AsymmetricStatusPanel/asymmetric-status-panel.schema", export: "asymmetricStatusPanelV1Patterns", category: "ui" },

  // Special: oneTakeLogo props
  { type: "oneTakeLogo", file: "Text/FlickerTitle/flicker-title.schema", export: "oneTakeLogoTextVariantProps", category: "text" },
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

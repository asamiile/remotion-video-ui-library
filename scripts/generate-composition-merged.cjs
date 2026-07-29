#!/usr/bin/env node
/**
 * Auto-generates composition-merged-*.ts files split by category.
 *
 * This script reads the families array below and generates 4 separate files:
 * - composition-merged-text.ts
 * - composition-merged-background.ts
 * - composition-merged-ui.ts
 * - composition-merged-other.ts
 *
 * Each file is self-contained and imports only the helper functions it needs.
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const COMPOSITION_DIR = path.join(SRC, "composition");

// ============================================================================
// Family definitions (order-controlled, with category assignment)
// ============================================================================

const families = [
  // Special: intro (goes to 'other')
  { type: "intro", file: "Intro/Intro/intro.schema", export: "defaultIntroV1Props", category: "other" },

  // Text compositions
  { type: "pattern", file: "Text/LedText/led-text.schema", export: "ledTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/NeonText/neon-text.schema", export: "neonTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/SlideInCaption/slide-in-caption.schema", export: "slideInCaptionV1Patterns", category: "text" },
  { type: "pattern", file: "Text/GlitchText/glitch-text.schema", export: "glitchTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/GlitchText/glitch-text-random.schema", export: "glitchTextV1RandomPatterns", category: "text" },
  { type: "pattern", file: "Text/WireText/wire-text.schema", export: "wireTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/NeonTextRainbow/neon-text-rainbow.schema", export: "neonTextRainbowV1Patterns", category: "text" },
  { type: "pattern", file: "Text/LightSweepText/light-sweep-text.schema", export: "lightSweepTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/DottedLineMarkerText/dotted-line-marker-text.schema", export: "dottedLineMarkerV1Patterns", localName: "dottedLineMarkerTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/TypewriterText/typewriter-text.schema", export: "typewriterTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/ShakeText/shake-text.schema", export: "shakeTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/ConfettiPopText/confetti-pop-text.schema", export: "confettiPopTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/CodeStream/code-stream.schema", export: "codeStreamPatterns", category: "text" },
  { type: "pattern", file: "Text/StackedRevealText/stacked-reveal-text.schema", export: "stackedRevealTextV1Patterns", category: "text" },
  { type: "pattern", file: "Text/TornNoteCaption/torn-note-caption.schema", export: "tornNoteCaptionV1Patterns", category: "text" },
  { type: "pattern", file: "Text/DistressedTitleCard/distressed-title-card.schema", export: "distressedTitleCardV1Patterns", category: "text" },
  { type: "pattern", file: "Text/SprayPaintText/spray-paint-text.schema", export: "sprayPaintTextV1Patterns", category: "text" },

  // Background composition
  { type: "pattern", file: "Background/RandomLinesBackground/random-lines.schema", export: "randomLinesV1Patterns", localName: "randomLinesBackgroundV1Patterns", category: "background" },

  // UI compositions
  { type: "pattern", file: "UI/BattleCalloutBanner/battle-callout-banner.schema", export: "battleCalloutBannerV1Patterns", category: "ui" },
  { type: "pattern", file: "UI/AsymmetricStatusPanel/asymmetric-status-panel.schema", export: "asymmetricStatusPanelV1Patterns", category: "ui" },

  // Other compositions
  { type: "pattern", file: "Loading/LoadingIcon/loading-icon.schema", export: "loadingIconV1Patterns", category: "other" },

  // Special: oneTakeLogo props (goes to 'text' because it's used by root-text.tsx)
  { type: "oneTakeLogo", file: "Text/FlickerTitle/flicker-title.schema", export: "oneTakeLogoTextVariantProps", category: "text" },

  // Location & Map (go to 'other' since root-other.tsx uses them)
  // Note: these are not generated separately; they're built from Location keys
];

// ============================================================================
// Generate files by category
// ============================================================================

// Group families by category
const byCategory = {
  text: [],
  background: [],
  ui: [],
  other: [],
};

for (const family of families) {
  const cat = family.category || "other";
  byCategory[cat].push(family);
}

// Special handling: merge location/map handling into 'text' category (Location is a Text composition)
byCategory.text.push({
  type: "special",
  category: "text",
  export: "mergedOneTakeLogoTextV1Props",
});

byCategory.text.push({
  type: "locationAndMap",
  category: "text",
});

// Validation
for (const family of families) {
  if (family.type === "intro" || family.type === "pattern" || family.type === "oneTakeLogo") {
    const fullPath = path.join(SRC, family.file + ".ts");
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
  }
}

// Generate each category file
function generateCategoryFile(categoryName, categorizedFamilies) {
  const imports = [];
  const exportLines = [];
  const needsLocationHelper = false;

  // Collect imports
  for (const family of categorizedFamilies) {
    if (family.type === "intro" || family.type === "pattern" || family.type === "oneTakeLogo") {
      const importPath = `../${family.file}`;
      imports.push(`import { ${family.export} } from "${importPath}";`);
    }
  }

  // Add merge helpers import if any pattern exists
  const hasPattern = categorizedFamilies.some(f => f.type === "pattern");
  const hasIntro = categorizedFamilies.some(f => f.type === "intro");
  const hasLocationAndMap = categorizedFamilies.some(f => f.type === "locationAndMap");

  if (hasPattern || hasIntro || hasLocationAndMap) {
    const helperImports = [];
    if (hasPattern || hasIntro) {
      helperImports.push("getEffectiveCompositionText");
      helperImports.push("shallowMergePatternRecord");
    }
    if (hasLocationAndMap) {
      helperImports.push("buildLocationConfigsFromCompositionKeys");
      helperImports.push("buildMapLocationPointsFromCompositionKeys");
      helperImports.push("getLocationV1CompositionKeys");
    }

    imports.push(
      `import {
  ${helperImports.join(",\n  ")},
} from "./merge-composition-local";`
    );
  }

  // Local setup
  const localSetup = [];
  if (hasPattern || hasIntro) {
    localSetup.push("const local = getEffectiveCompositionText();");
  }
  if (hasLocationAndMap) {
    if (!localSetup.length) {
      localSetup.push("const local = getEffectiveCompositionText();");
    }
    localSetup.push("const locationV1CompositionKeys = getLocationV1CompositionKeys();");
  }

  // Generate exports
  for (const family of categorizedFamilies) {
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

      exportLines.push(`export const ${mergedName} = shallowMergePatternRecord(`);
      exportLines.push(`  ${family.export},`);
      exportLines.push(`  local.${localName},`);
      exportLines.push(`) as typeof ${family.export};`);
      exportLines.push("");
    } else if (family.type === "special" && family.export === "mergedOneTakeLogoTextV1Props") {
      exportLines.push("export const mergedOneTakeLogoTextV1Props = {");
      exportLines.push("  ...oneTakeLogoTextVariantProps,");
      exportLines.push("  ...(local.oneTakeLogoTextV1 || {}),");
      exportLines.push("};");
      exportLines.push("");
    } else if (family.type === "locationAndMap") {
      // Location and Map exports
      exportLines.push("export const mergedLocationConfigs =");
      exportLines.push("  buildLocationConfigsFromCompositionKeys(local, locationV1CompositionKeys);");
      exportLines.push("");
      exportLines.push("export const mergedMapLocationPoints =");
      exportLines.push("  buildMapLocationPointsFromCompositionKeys(local, locationV1CompositionKeys);");
      exportLines.push("");
    }
  }

  const output = [
    ...imports,
    ...localSetup.map(line => line),
    "",
    ...exportLines,
  ].filter(line => line !== undefined).join("\n");

  return output + "\n";
}

// Write files
const categories = ["text", "background", "ui", "other"];

for (const cat of categories) {
  if (byCategory[cat].length > 0) {
    const filename = `composition-merged-${cat}.ts`;
    const filepath = path.join(COMPOSITION_DIR, filename);
    const content = generateCategoryFile(cat, byCategory[cat]);
    fs.writeFileSync(filepath, content, "utf8");
    console.error(`✅ Generated ${filename}`);
  }
}

console.error("✅ All composition-merged-*.ts files generated");

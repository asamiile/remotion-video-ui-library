// Text-effect composition IDs (uses the same capPattern as Root.tsx). Enumerated from each schema.ts.
// composition-text.local.json only overrides copy — it's not the source of truth for IDs.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const families = [
  {
    idPrefix: "LedText",
    file: "src/Text/LedText/led-text.schema.ts",
    exportName: "ledTextPatterns",
  },
  {
    idPrefix: "NeonText",
    file: "src/Text/NeonText/neon-text.schema.ts",
    exportName: "neonTextPatterns",
  },
  {
    idPrefix: "SlideInCaption",
    file: "src/Text/SlideInCaption/slide-in-caption.schema.ts",
    exportName: "slideInCaptionPatterns",
  },
  {
    idPrefix: "GlitchText",
    file: "src/Text/GlitchText/glitch-text.schema.ts",
    exportName: "glitchTextPatterns",
  },
  {
    idPrefix: "WireText",
    file: "src/Text/WireText/wire-text.schema.ts",
    exportName: "wireTextPatterns",
  },
  {
    idPrefix: "NeonText-Rainbow",
    file: "src/Text/NeonTextRainbow/neon-text-rainbow.schema.ts",
    exportName: "neonTextRainbowPatterns",
    join: "",
  },
  {
    idPrefix: "LightSweepText",
    file: "src/Text/LightSweepText/light-sweep-text.schema.ts",
    exportName: "lightSweepTextPatterns",
  },
  {
    idPrefix: "DottedLineMarkerText",
    file: "src/Text/DottedLineMarkerText/dotted-line-marker-text.schema.ts",
    exportName: "dottedLineMarkerPatterns",
  },
  {
    idPrefix: "TypewriterText",
    file: "src/Text/TypewriterText/typewriter-text.schema.ts",
    exportName: "typewriterTextPatterns",
  },
  {
    idPrefix: "ShakeText",
    file: "src/Text/ShakeText/shake-text.schema.ts",
    exportName: "shakeTextPatterns",
  },
  {
    idPrefix: "ConfettiPopText",
    file: "src/Text/ConfettiPopText/confetti-pop-text.schema.ts",
    exportName: "confettiPopTextPatterns",
  },
  {
    idPrefix: "CodeStream",
    file: "src/Text/CodeStream/code-stream.schema.ts",
    exportName: "codeStreamPatterns",
    join: "",
  },
  {
    idPrefix: "StackedRevealText",
    file: "src/Text/StackedRevealText/stacked-reveal-text.schema.ts",
    exportName: "stackedRevealTextPatterns",
  },
  {
    idPrefix: "TornNoteCaption",
    file: "src/Text/TornNoteCaption/torn-note-caption.schema.ts",
    exportName: "tornNoteCaptionPatterns",
  },
  {
    idPrefix: "DistressedTitleCard",
    file: "src/Text/DistressedTitleCard/distressed-title-card.schema.ts",
    exportName: "distressedTitleCardPatterns",
  },
  {
    idPrefix: "SprayPaintText",
    file: "src/Text/SprayPaintText/spray-paint-text.schema.ts",
    exportName: "sprayPaintTextPatterns",
  },
  {
    idPrefix: "ChromaticLogoText",
    file: "src/Text/ChromaticLogoText/chromatic-logo-text.schema.ts",
    exportName: "chromaticLogoTextPatterns",
  },
  {
    idPrefix: "RubyWordplayText",
    file: "src/Text/RubyWordplayText/ruby-wordplay-text.schema.ts",
    exportName: "rubyWordplayTextPatterns",
  },
  {
    idPrefix: "PedigreeCreditText",
    file: "src/Text/PedigreeCreditText/pedigree-credit-text.schema.ts",
    exportName: "pedigreeCreditTextPatterns",
  },
  {
    idPrefix: "ChapterTitleCard",
    file: "src/Text/ChapterTitleCard/chapter-title-card.schema.ts",
    exportName: "chapterTitleCardPatterns",
  },
  {
    idPrefix: "DiegeticMaterialCredit",
    file: "src/Text/DiegeticMaterialCredit/diegetic-material-credit.schema.ts",
    exportName: "diegeticMaterialCreditPatterns",
  },
  {
    idPrefix: "CinematicPresentsCredit",
    file: "src/Text/CinematicPresentsCredit/cinematic-presents-credit.schema.ts",
    exportName: "cinematicPresentsCreditPatterns",
  },
  {
    idPrefix: "InterviewQuestionCaption",
    file: "src/Text/InterviewQuestionCaption/interview-question-caption.schema.ts",
    exportName: "interviewQuestionCaptionPatterns",
  },
  {
    idPrefix: "AnnouncementEndCard",
    file: "src/Text/AnnouncementEndCard/announcement-end-card.schema.ts",
    exportName: "announcementEndCardPatterns",
  },
  {
    idPrefix: "EmergingNoiseTitle",
    file: "src/Text/EmergingNoiseTitle/emerging-noise-title.schema.ts",
    exportName: "emergingNoiseTitlePatterns",
  },
];

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  const sep = fam.join === "" ? "" : "-";
  for (const patternId of keys) {
    const id = fam.preservePatternCase ? patternId : capPattern(patternId);
    process.stdout.write(`${fam.idPrefix}${sep}${id}\n`);
  }
}

const fixedIds = [
  "GlitchTextRandom-harshSignalRandom-01",
  "GlitchTextRandom-harshSignalRandom-02",
  "DottedLineMarkerText-01",
  "DottedLineMarkerText-02",
  "DottedLineMarkerText-GlitchHandover",
  "FlickerTitle",
];

for (const id of fixedIds) {
  process.stdout.write(`${id}\n`);
}

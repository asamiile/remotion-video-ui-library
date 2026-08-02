import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const DIEGETIC_MATERIAL_VARIANTS = [
  "script",
  "engraved",
  "graffiti",
] as const;

export const diegeticMaterialCreditSchema = z.object({
  /** script: lipstick-on-mirror cursive. engraved: brass-plate serif. graffiti: rough spray/blood-drip */
  variant: z.enum(DIEGETIC_MATERIAL_VARIANTS).default("script"),

  creditName: z.string().default("SAMPLE NAME"),
  roleLabel: z.string().default("SAMPLE ROLE"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontSize: z.number().min(16).max(160).default(52),
  roleFontSize: z.number().min(10).max(60).default(20),

  scriptColor: zColor().default("#d7263d"),
  engravedColor: zColor().default("#d8b878"),
  engravedPlateColor: zColor().default("#2a2620"),
  graffitiColor: zColor().default("#8a0f1e"),

  backgroundColor: zColor().default("#0a0a0f"),
  /** Blurred colored surface behind the text, simulating a shallow-depth-of-field
   * out-of-focus world (a door/mirror/piano would live here) */
  backdropColor: zColor().default("#3a2e2e"),
  backdropBlurPx: z.number().min(0).max(60).default(28),

  /** Drip marks hanging below the text (graffiti variant only) */
  dripCount: z.number().min(0).max(10).default(5),

  randomSeed: z.string().default("diegetic-credit"),
  fadeInFrames: z.number().min(0).default(20),
  delayFrames: z.number().min(0).default(0),
});

export type DiegeticMaterialCreditSchemaType = z.infer<
  typeof diegeticMaterialCreditSchema
>;

export const diegeticMaterialCreditDurationFrames = 150;

export const defaultDiegeticMaterialCreditProps = {
  variant: "script" as const,
  creditName: "SAMPLE NAME",
  roleLabel: "SAMPLE ROLE",

  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontSize: 52,
  roleFontSize: 20,

  scriptColor: "#d7263d",
  engravedColor: "#d8b878",
  engravedPlateColor: "#2a2620",
  graffitiColor: "#8a0f1e",

  backgroundColor: "#0a0a0f",
  backdropColor: "#3a2e2e",
  backdropBlurPx: 28,

  dripCount: 5,

  randomSeed: "diegetic-credit",
  fadeInFrames: 20,
  delayFrames: 0,
} as const;

export const diegeticMaterialCreditPatterns = {
  /** Lipstick-on-mirror cursive credit (English default) */
  lipstickScript: {
    ...defaultDiegeticMaterialCreditProps,
    variant: "script" as const,
    creditName: "SAMPLE NAME",
    roleLabel: "SAMPLE ROLE",
  },

  /** Brass engraved plate credit */
  brassEngraved: {
    ...defaultDiegeticMaterialCreditProps,
    variant: "engraved" as const,
    creditName: "SAMPLE NAME",
    roleLabel: "SAMPLE ROLE",
    backdropColor: "#1c1a16",
  },

  /** Rough spray/blood-drip graffiti credit */
  bloodGraffiti: {
    ...defaultDiegeticMaterialCreditProps,
    variant: "graffiti" as const,
    creditName: "SAMPLE NAME",
    roleLabel: "SAMPLE ROLE",
    backdropColor: "#241417",
  },
};

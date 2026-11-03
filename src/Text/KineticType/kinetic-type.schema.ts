import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { MONTSERRAT_FONT_FAMILY } from "../../helpers/font-montserrat";
import { OSWALD_FONT_FAMILY } from "../../helpers/font-oswald";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

export const KINETIC_TYPE_STYLES = [
  "wave",
  "tunnel",
  "sphere",
  "stack",
  "fold",
  "ribbons",
  "liquid",
  "boxTunnel",
  "cloth",
] as const;

/**
 * Full-screen kinetic typography: words repeated in rows that scroll in
 * alternating directions, mapped onto a surface (sheet, tunnel, sphere,
 * folded walls, a tilted plane, a waving cloth), or a single echoing word.
 */
export const kineticTypeSchema = z.object({
  /**
   * wave = the rows ripple across the frame like a flag; tunnel = the rows
   * line the inside of a cylinder the camera flies through; sphere = the rows
   * wrap a see-through spinning sphere over faint background rows; stack =
   * one copy of the text per row, fitted to the frame width and stacked
   * tightly, its letters leaning back and forth in a travelling wave; fold =
   * rows on two walls meeting in an inside corner, colored in pairs of rows;
   * ribbons = a tilted plane of strips receding into the distance, filled
   * bands with dark text alternating with outlined text; liquid = one word in
   * the center with colored echoes smearing sideways over a bulging grid;
   * boxTunnel = a square tunnel whose walls carry text running toward the
   * vanishing point; cloth = dense rows on a waving sheet in perspective with
   * a red/cyan split and blurred edges
   */
  style: z.enum(KINETIC_TYPE_STYLES),
  text: z.string(),
  /** Word for odd rows (outlined / dark bands); empty repeats `text` */
  subText: z.string(),
  fontFamily: z.string(),
  fontWeight: z.enum(["400", "700", "800"]),
  /** Filled rows; the band color for ribbons / boxTunnel; the word in liquid */
  textColor: zColor(),
  /** Outlined rows; the second row pair in fold; text on bands; the liquid grid */
  accentColor: zColor(),
  /** "transparent" for an overlay */
  backgroundColor: zColor(),
  /**
   * Rows of text: across the frame (wave, fold, ribbons, cloth), along the
   * tunnel, or pole to pole (sphere); grid cells in liquid. stack fits rows to
   * the text width and boxTunnel uses two bands per wall instead.
   */
  rows: z.number().min(2).max(30),
  /**
   * Distortion strength: wave height, tunnel twist, sphere tilt, stack letter
   * lean, fold angle, ribbons sway, liquid bulge and echo spread, boxTunnel
   * roll, cloth wave height
   */
  distortion: z.number().min(0).max(2),
  /** Full scroll / spin cycles per loop; integers keep the loop seamless */
  loopCycles: z.number().int().min(1).max(6),
  /** RGB split, 0-1 */
  chromaticAberration: z.number().min(0).max(1),
  /** How often short glitch tears occur, 0-1 */
  glitch: z.number().min(0).max(1),
  /** Film grain and faint vertical streaks over the backdrop, 0-1 */
  grain: z.number().min(0).max(1),
  randomSeed: z.number().int().min(0).max(999),
});

export type KineticTypeSchemaType = z.infer<typeof kineticTypeSchema>;

export const kineticTypeDurationFrames = 600;

const base = {
  text: "KINETIC",
  subText: "",
  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontWeight: "700" as const,
  textColor: "#f2f0ea",
  backgroundColor: "#0b0b0d",
  distortion: 1,
  loopCycles: 2,
  chromaticAberration: 0.35,
  glitch: 0.25,
  grain: 0,
  randomSeed: 7,
};

export const kineticTypePatterns = {
  /** Rippling rows, off-white and lime */
  wave: {
    ...base,
    style: "wave" as const,
    text: "KINETIC",
    accentColor: "#c8ff3c",
    rows: 9,
  },
  /** Flying through a tunnel of type, off-white and violet */
  tunnel: {
    ...base,
    style: "tunnel" as const,
    text: "MOTION",
    accentColor: "#8a6cff",
    backgroundColor: "#07060c",
    rows: 14,
    randomSeed: 11,
  },
  /** See-through sphere of type, off-white and orange */
  sphere: {
    ...base,
    style: "sphere" as const,
    text: "TYPE",
    accentColor: "#ff8a2a",
    backgroundColor: "#0d0b09",
    rows: 12,
    loopCycles: 1,
    randomSeed: 23,
  },
  /** Width-fitted rows, filled and outlined white, heavy RGB split and grain */
  stack: {
    ...base,
    style: "stack" as const,
    text: "TYPE IN MOTION",
    fontFamily: MONTSERRAT_FONT_FAMILY,
    fontWeight: "800" as const,
    textColor: "#f4f4f2",
    accentColor: "#f4f4f2",
    backgroundColor: "#060606",
    rows: 6,
    loopCycles: 2,
    chromaticAberration: 0.85,
    glitch: 0.2,
    grain: 0.5,
    randomSeed: 31,
  },
  /** Condensed rows folding into an inside corner, white and red in pairs */
  fold: {
    ...base,
    style: "fold" as const,
    text: "KINETIC",
    fontFamily: OSWALD_FONT_FAMILY,
    textColor: "#f4f4f2",
    accentColor: "#e8392a",
    backgroundColor: "#050505",
    rows: 7,
    loopCycles: 1,
    chromaticAberration: 0.1,
    glitch: 0.1,
    grain: 0.2,
    randomSeed: 41,
  },
  /** Receding strips: white bands with black text, black bands with outlines */
  ribbons: {
    ...base,
    style: "ribbons" as const,
    text: "TYPOGRAPHY",
    subText: "ANIMATION",
    fontFamily: MONTSERRAT_FONT_FAMILY,
    fontWeight: "800" as const,
    textColor: "#f2f2f0",
    accentColor: "#0a0a0a",
    backgroundColor: "#050505",
    rows: 9,
    loopCycles: 1,
    chromaticAberration: 0.15,
    glitch: 0.1,
    grain: 0.25,
    randomSeed: 53,
  },
  /** One word with colored echoes over a bulging grid */
  liquid: {
    ...base,
    style: "liquid" as const,
    text: "LIQUID",
    fontFamily: OSWALD_FONT_FAMILY,
    textColor: "#ffffff",
    accentColor: "#e6e6e6",
    backgroundColor: "#040404",
    rows: 8,
    loopCycles: 2,
    chromaticAberration: 0.2,
    glitch: 0.2,
    grain: 0.15,
    randomSeed: 61,
  },
  /** Square tunnel of white and black bands, text running to the vanishing point */
  boxTunnel: {
    ...base,
    style: "boxTunnel" as const,
    text: "TYPOGRAPHY",
    subText: "ANIMATION",
    fontFamily: OSWALD_FONT_FAMILY,
    textColor: "#f2f2f0",
    accentColor: "#0a0a0a",
    backgroundColor: "#000000",
    rows: 8,
    loopCycles: 1,
    chromaticAberration: 0.35,
    glitch: 0.1,
    grain: 0.2,
    randomSeed: 71,
  },
  /** Dense rows on a waving cloth, red/cyan split and blurred corners */
  cloth: {
    ...base,
    style: "cloth" as const,
    text: "WORLD WAVE",
    fontFamily: OSWALD_FONT_FAMILY,
    textColor: "#f2f2f0",
    accentColor: "#f2f2f0",
    backgroundColor: "#050505",
    rows: 14,
    loopCycles: 1,
    chromaticAberration: 0.6,
    glitch: 0.1,
    grain: 0.2,
    randomSeed: 83,
  },
};

import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

export const TV_SCREEN_STYLES = ["crt", "vhs", "digital", "mono"] as const;

/**
 * A full-frame TV picture (no cabinet): the screen powers on, shows the
 * title, loses the signal, and ends on that display's kind of dead air.
 */
export const tvScreenTextSchema = z.object({
  /**
   * crt = tube picture with scanlines, RGB fringe, glow, vignette and glass
   * sheen; tears and rolls into black-and-white snow. vhs = tape playback
   * with wobble, color bleed, a tracking band and a PLAY label; the tracking
   * band takes over before the snow. digital = crisp LCD with a faint
   * subpixel grid; breaks into macroblocks, colored block noise, then NO
   * SIGNAL. mono = green phosphor monitor with heavy glow; tears and rolls
   * into green snow.
   */
  style: z.enum(TV_SCREEN_STYLES),
  text: z.string(),
  /** Second line under the title; empty hides it */
  subText: z.string(),
  fontFamily: z.string(),
  fontSize: z.number().min(24).max(320),
  /** Text color on the picture */
  textColor: zColor(),
  /** Picture background behind the text */
  screenColor: zColor(),
  /** Corner label shown while playing (vhs only); empty hides it */
  osdText: z.string(),

  /** Frame the screen powers on */
  powerOnFrame: z.number().int().min(0),
  /** Frame the signal starts breaking up */
  glitchStartFrame: z.number().int().min(0),
  /** Frame the picture is fully replaced by dead air */
  staticStartFrame: z.number().int().min(0),
  /** Darkness between scanlines, 0-1 (crt, vhs, mono) */
  scanlines: z.number().min(0).max(1),
  randomSeed: z.number().int().min(0).max(999),
});

export type TvScreenTextSchemaType = z.infer<typeof tvScreenTextSchema>;

export const tvScreenTextDurationFrames = 300;

const base = {
  subText: "",
  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 150,
  osdText: "",
  powerOnFrame: 12,
  glitchStartFrame: 200,
  staticStartFrame: 226,
  scanlines: 0.35,
  randomSeed: 7,
};

export const tvScreenTextPatterns = {
  /** Retro tube picture, phosphor white on deep blue */
  crt: {
    ...base,
    style: "crt" as const,
    text: "NOW ON AIR",
    subText: "CHANNEL 7",
    textColor: "#eaf3ff",
    screenColor: "#0b1622",
  },
  /** Japanese sample */
  crtJp: {
    ...base,
    style: "crt" as const,
    text: "放送開始",
    subText: "チャンネル 7",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    textColor: "#eaf3ff",
    screenColor: "#0b1622",
    randomSeed: 12,
  },
  /** Tape playback, warm white on a faded blue */
  vhs: {
    ...base,
    style: "vhs" as const,
    text: "HOME VIDEO",
    subText: "SUMMER 1989",
    textColor: "#f4efe4",
    screenColor: "#1a2340",
    osdText: "PLAY ▶",
    scanlines: 0.18,
    randomSeed: 19,
  },
  /** Crisp LCD picture, white on near-black */
  digital: {
    ...base,
    style: "digital" as const,
    text: "LIVE BROADCAST",
    subText: "CH 07 HD",
    fontSize: 130,
    textColor: "#ffffff",
    screenColor: "#0a0c10",
    scanlines: 0,
    randomSeed: 27,
  },
  /** Green phosphor monitor */
  mono: {
    ...base,
    style: "mono" as const,
    text: "SYSTEM READY",
    subText: "> AWAITING INPUT",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    fontSize: 120,
    textColor: "#5dff8a",
    screenColor: "#020a04",
    scanlines: 0.45,
    randomSeed: 33,
  },
};

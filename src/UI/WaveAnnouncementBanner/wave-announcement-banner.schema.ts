import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const waveAnnouncementBannerSchema = z.object({
  bannerText: z.string().default("SAMPLE LIMITED EDITION"),

  bannerColor: zColor().default("#ff2d9e"),
  textColor: zColor().default("#ffffff"),

  waveAmplitudePx: z.number().min(0).max(60).default(14),
  waveFrequency: z.number().min(0.5).max(6).default(2),
  bandThicknessPx: z.number().min(20).max(300).default(90),
  rotationDeg: z.number().min(-45).max(45).default(-6),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontSize: z.number().min(12).max(80).default(28),

  backgroundColor: zColor().default("#05060a"),

  popInFrames: z.number().min(0).default(14),
  delayFrames: z.number().min(0).default(0),
});

export type WaveAnnouncementBannerSchemaType = z.infer<
  typeof waveAnnouncementBannerSchema
>;

export const waveAnnouncementBannerDurationFrames = 150;

export const defaultWaveAnnouncementBannerProps = {
  bannerText: "SAMPLE LIMITED EDITION",

  bannerColor: "#ff2d9e",
  textColor: "#ffffff",

  waveAmplitudePx: 14,
  waveFrequency: 2,
  bandThicknessPx: 90,
  rotationDeg: -6,

  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontSize: 28,

  backgroundColor: "#05060a",

  popInFrames: 14,
  delayFrames: 0,
} as const;

export const waveAnnouncementBannerPatterns = {
  /** Diagonal pink wave banner with white cutout-style text (English default) */
  pinkWave: {
    ...defaultWaveAnnouncementBannerProps,
    bannerText: "SAMPLE LIMITED EDITION",
  },

  /** Same layout, Japanese sample copy */
  pinkWaveJp: {
    ...defaultWaveAnnouncementBannerProps,
    bannerText: "サンプル初回限定版",
  },
};

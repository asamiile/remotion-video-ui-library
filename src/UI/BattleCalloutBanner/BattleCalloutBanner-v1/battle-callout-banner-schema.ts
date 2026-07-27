import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const battleCalloutBannerSchemaV1 = z.object({
  text: z.string().default("ALL-OUT ATTACK!"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontSize: z.number().min(16).max(120).default(44),
  letterSpacing: z.string().default("0.02em"),

  bannerColor: zColor().default("#0a0a0f"),
  textColor: zColor().default("#eef1fc"),
  borderColor: zColor().default("#eef1fc"),
  borderWidthPx: z.number().min(0).max(12).default(3),
  /** How much the top-left/bottom-right corners are diagonally cut (px) */
  cornerCutPx: z.number().min(0).max(80).default(28),

  /** Small circular avatar placeholder attached to one side (a colored initial, not real character art) */
  avatarEnabled: z.boolean().default(true),
  avatarInitial: z.string().default("P"),
  avatarColor: zColor().default("#37e9ff"),
  avatarSizePx: z.number().min(0).default(84),

  backgroundColor: zColor().default("#060810"),

  popInFrames: z.number().min(0).default(8),
  delayFrames: z.number().min(0).default(0),
});

export type BattleCalloutBannerSchemaV1Type = z.infer<
  typeof battleCalloutBannerSchemaV1
>;

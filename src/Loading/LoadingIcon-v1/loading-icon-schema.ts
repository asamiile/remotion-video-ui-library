import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const loadingIconSchemaV1 = z.object({
  size: z.number().min(50).max(300).default(150),
  lightColor: zColor().default("#DFE2D7"),
  darkColor: zColor().default("#6B685C"),
  strokeWidth: z.number().min(1).max(10).default(4),

  showText: z.boolean().default(true),
  text: z.string().default("読み込みサンプル…"),
  textColor: zColor().default("#DFE2D7"),
  fontSize: z.number().min(10).max(60).default(18),
  fontFamily: z.string().default("'Line Seed JP_100'"),
  fontWeight: z.enum(["400", "700"]).default("400"),

  positionX: z.number().default(50), // %
  positionY: z.number().default(50), // %

  rotationDuration: z.number().min(1).default(60), // frames for one full rotation
  fadeInDuration: z.number().min(0).default(30), // fade-in duration
  fadeOutDuration: z.number().min(0).default(30), // fade-out duration
  delayFrames: z.number().min(0).default(0), // delay before starting, in frames
});

export type LoadingIconSchemaV1Type = z.infer<typeof loadingIconSchemaV1>;

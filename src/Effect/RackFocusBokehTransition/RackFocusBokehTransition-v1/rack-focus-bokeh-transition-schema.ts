import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const rackFocusBokehTransitionSchemaV1 = z.object({
  backgroundColor: zColor().default("#060810"),
  bokehColors: z
    .array(zColor())
    .default(["#eef1fc", "#37e9ff", "#ff8a3d"]),

  bokehCount: z.number().min(0).max(30).default(10),
  bokehMinSizePx: z.number().min(1).default(30),
  bokehMaxSizePx: z.number().min(1).default(120),
  blurMaxPx: z.number().min(0).max(60).default(24),

  /** Frames for blur to ramp up / back down. Total duration = rampFrames*2 + holdFrames */
  rampFrames: z.number().min(1).default(10),
  holdFrames: z.number().min(0).default(6),

  randomSeed: z.string().default("rack-focus-bokeh-v1"),
});

export type RackFocusBokehTransitionSchemaV1Type = z.infer<
  typeof rackFocusBokehTransitionSchemaV1
>;

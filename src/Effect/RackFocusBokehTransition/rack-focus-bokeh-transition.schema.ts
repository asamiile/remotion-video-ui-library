import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const rackFocusBokehTransitionSchema = z.object({
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

  randomSeed: z.string().default("rack-focus-bokeh"),
});

export type RackFocusBokehTransitionSchemaType = z.infer<
  typeof rackFocusBokehTransitionSchema
>;

export const rackFocusBokehTransitionDurationFrames = 52;

export const defaultRackFocusBokehTransitionProps = {
  backgroundColor: "#060810",
  bokehColors: ["#eef1fc", "#37e9ff", "#ff8a3d"],
  bokehCount: 10,
  bokehMinSizePx: 30,
  bokehMaxSizePx: 120,
  blurMaxPx: 24,
  rampFrames: 10,
  holdFrames: 6,
  randomSeed: "rack-focus-bokeh",
} as const;


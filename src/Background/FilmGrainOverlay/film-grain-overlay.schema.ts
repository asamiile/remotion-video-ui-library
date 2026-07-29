import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const filmGrainOverlaySchemaV1 = z.object({
  /** baseFrequency for the SVG feTurbulence; higher values make the grain finer */
  grainScale: z.number().min(0.05).max(2).default(0.9),
  /** Overall opacity of the grain overlay */
  grainOpacity: z.number().min(0).max(1).default(0.12),
  /** How often (in frames) the grain pattern regenerates; lower = faster flicker */
  grainUpdateEveryFrames: z.number().min(1).default(2),
  grainTintColor: zColor().default("#7c86a8"),

  /** Number and intensity of film scratches (vertical lines); 0 hides them */
  scratchCount: z.number().min(0).max(20).default(0),
  scratchOpacity: z.number().min(0).max(1).default(0.35),
  /** How often (in frames) scratches are re-rolled, i.e. how often they appear/disappear */
  scratchFlickerEveryFrames: z.number().min(1).default(6),

  randomSeed: z.string().default("film-grain-v1"),
});

export type FilmGrainOverlaySchemaV1Type = z.infer<
  typeof filmGrainOverlaySchemaV1
>;


export const defaultFilmGrainOverlayV1Props = {
  grainScale: 0.9,
  grainOpacity: 0.12,
  grainUpdateEveryFrames: 2,
  grainTintColor: "#7c86a8",

  scratchCount: 0,
  scratchOpacity: 0.35,
  scratchFlickerEveryFrames: 6,

  randomSeed: "film-grain-v1",
};
export const filmGrainOverlayV1Patterns = {
  /** Restrained grain for a single climactic moment (matches the vol. 37 PV) */
  subtle: {
    ...defaultFilmGrainOverlayV1Props,
    grainOpacity: 0.12,
    scratchCount: 0,
  },

  /** For flashback scenes: heavier grain plus film scratches (matches the vol. 38 PV) */
  heavyDegraded: {
    ...defaultFilmGrainOverlayV1Props,
    grainOpacity: 0.28,
    grainScale: 1.1,
    scratchCount: 6,
    scratchOpacity: 0.4,
  },
};

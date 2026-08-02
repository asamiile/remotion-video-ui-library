import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const starfieldPlanetSilhouetteSchema = z.object({
  backgroundColor: zColor().default("#05060f"),

  starCount: z.number().min(0).max(400).default(140),
  starColor: zColor().default("#eef1fc"),
  starTwinkle: z.boolean().default(true),

  planetColor: zColor().default("#1c2440"),
  planetRadiusPx: z.number().min(20).max(600).default(180),
  planetXPercent: z.number().min(0).max(100).default(72),
  planetYPercent: z.number().min(0).max(100).default(38),

  /** Cuts a crescent out of the planet by overlapping a background-colored circle */
  crescentEnabled: z.boolean().default(true),
  crescentOffsetPercent: z.number().min(0).max(100).default(35),

  glowColor: zColor().default("#37e9ff"),
  glowOpacity: z.number().min(0).max(1).default(0.25),

  randomSeed: z.string().default("starfield"),
});

export type StarfieldPlanetSilhouetteSchemaType = z.infer<
  typeof starfieldPlanetSilhouetteSchema
>;

export const defaultStarfieldPlanetSilhouetteProps = {
  backgroundColor: "#05060f",

  starCount: 140,
  starColor: "#eef1fc",
  starTwinkle: true,

  planetColor: "#1c2440",
  planetRadiusPx: 180,
  planetXPercent: 72,
  planetYPercent: 38,

  crescentEnabled: true,
  crescentOffsetPercent: 35,

  glowColor: "#37e9ff",
  glowOpacity: 0.25,

  randomSeed: "starfield",
} as const;

export const starfieldPlanetSilhouettePatterns = {
  /** Crescent planet against a twinkling starfield (English default) */
  crescentMoon: {
    ...defaultStarfieldPlanetSilhouetteProps,
    crescentEnabled: true,
  },

  /** Full planet silhouette, no crescent cut */
  fullPlanet: {
    ...defaultStarfieldPlanetSilhouetteProps,
    crescentEnabled: false,
    planetColor: "#2a1c40",
    glowColor: "#ff2d9e",
  },
};

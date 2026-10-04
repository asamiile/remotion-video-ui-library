import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const footagePassModes = ["edges", "thermal", "segment", "attention", "mosaic"] as const;

export const footagePassSchema = z.object({
  /** Image or video: path under public/, a URL, or "" for the built-in street demo */
  src: z.string(),
  /** Where playback starts inside a video source */
  startSeconds: z.number().min(0),
  /**
   * edges: gradient-magnitude line drawing; thermal: luminance as heat;
   * segment: flat color classes with outlines; attention: saliency heatmap;
   * mosaic: a 3x3 grid of feature maps
   */
  mode: z.enum(footagePassModes),
  /** Wipe the pass in over the source and back out once per loop */
  reveal: z.boolean(),
  /** Edge lines, wipe line, labels */
  lineColor: zColor(),
  /** Edge sensitivity */
  gain: z.number().min(0.2).max(5),
  showLabels: z.boolean(),
  durationSeconds: z.number().int().min(5).max(60),
});

export type FootagePassSchemaType = z.infer<typeof footagePassSchema>;

export const footagePassDurationFrames = (props: { durationSeconds: number }) =>
  props.durationSeconds * 30;

export const defaultFootagePassProps: FootagePassSchemaType = {
  src: "",
  startSeconds: 0,
  mode: "edges",
  reveal: true,
  lineColor: "#39ff88",
  gain: 1,
  showLabels: true,
  durationSeconds: 10,
};

export const footagePassPatterns: Record<string, FootagePassSchemaType> = {
  edgesReveal: defaultFootagePassProps,
  thermal: { ...defaultFootagePassProps, mode: "thermal", lineColor: "#ffffff" },
  segment: { ...defaultFootagePassProps, mode: "segment", lineColor: "#ffffff" },
  attention: { ...defaultFootagePassProps, mode: "attention", reveal: false, lineColor: "#ffffff" },
  featureMosaic: { ...defaultFootagePassProps, mode: "mosaic", reveal: false, lineColor: "#4fd8ff" },
};

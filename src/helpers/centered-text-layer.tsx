import { zColor } from "@remotion/zod-types";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";
import "./font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "./font-space-grotesk";

/**
 * Large, still text for compositions that place copy over an animated
 * background. Spread `centeredTextFields` into a schema and
 * `defaultCenteredTextProps` into its defaults.
 */
export const centeredTextFields = {
  /** Use "\n" to break lines; text never wraps on its own */
  text: z.string().default("Sample Text"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(24).max(480).default(260),
  fontWeight: z.number().min(100).max(900).default(700),
  letterSpacing: z.string().default("-0.02em"),
  textColor: zColor().default("#ffffff"),
  /** Text opacity, independent of textColor (0 = invisible, 1 = opaque) */
  textOpacity: z.number().min(0).max(1).default(1),
  /** Horizontal offset from center, as a fraction of frame width (positive = right) */
  textOffsetX: z.number().min(-0.5).max(0.5).default(0),
  /** Vertical offset from center, as a fraction of frame height (positive = down) */
  textOffsetY: z.number().min(-0.5).max(0.5).default(0),
};

export type CenteredTextProps = z.infer<z.ZodObject<typeof centeredTextFields>>;

export const defaultCenteredTextProps = {
  text: "Sample Text",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 260,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  textColor: "#ffffff",
  textOpacity: 1,
  textOffsetX: 0,
  textOffsetY: 0,
} as const satisfies CenteredTextProps;

export const CenteredTextLayer: React.FC<CenteredTextProps> = ({
  text,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  textColor,
  textOpacity,
  textOffsetX,
  textOffsetY,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${textOffsetX * width}px, ${textOffsetY * height}px)`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight: 1,
          color: textColor,
          opacity: textOpacity,
          // Break only at "\n" in the text, never automatically
          whiteSpace: "pre",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as starfieldSchema } from "../../helpers/shader/background/shader-background.schema";

export const starfieldDurationFrames = shaderBackgroundDurationFrames;

export const starfieldPatterns: Record<string, ShaderBackgroundSchemaType> = {
  classic: {
    ...shaderBackgroundBase,
    backgroundColor: "transparent",
    colorA: "#ffffff",
    colorB: "#9ecbff",
    colorC: "#ffe29a",
  },
};

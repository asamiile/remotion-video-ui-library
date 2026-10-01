import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as kaleidoscopeSchema } from "../../helpers/shader/background/shader-background.schema";

export const kaleidoscopeDurationFrames = shaderBackgroundDurationFrames;

export const kaleidoscopePatterns: Record<string, ShaderBackgroundSchemaType> = {
  classic: {
    ...shaderBackgroundBase,
    backgroundColor: "#07060f",
    colorA: "#00d1b2",
    colorB: "#3a0ca3",
    colorC: "#f9f871",
  },
};

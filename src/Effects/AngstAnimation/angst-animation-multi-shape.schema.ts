import { z } from "zod";

export const angstAnimationMultiShapeSchema = z.object({});

export const defaultAngstAnimationMultiShapeProps = {};

export type AngstAnimationMultiShapeProps = z.infer<
  typeof angstAnimationMultiShapeSchema
>;

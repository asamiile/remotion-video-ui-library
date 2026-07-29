import { z } from "zod";

export const angstAnimationSchema = z.object({});

export const defaultAngstAnimationProps = {};

export type AngstAnimationProps = z.infer<
  typeof angstAnimationSchema
>;

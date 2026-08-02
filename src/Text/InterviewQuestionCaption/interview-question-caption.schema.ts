import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const interviewQuestionCaptionSchema = z.object({
  questionText: z.string().default("SAMPLE QUESTION TEXT?"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontSize: z.number().min(16).max(120).default(44),
  letterSpacing: z.string().default("0.01em"),

  textColor: zColor().default("#ff2d9e"),
  outlineColor: zColor().default("#ffffff"),

  /** Stand-in for live-action interview footage behind the caption */
  footagePlaceholderColor: zColor().default("#1c1c22"),

  verticalPositionPercent: z.number().min(0).max(100).default(78),

  popInFrames: z.number().min(0).default(10),
  delayFrames: z.number().min(0).default(0),
});

export type InterviewQuestionCaptionSchemaType = z.infer<
  typeof interviewQuestionCaptionSchema
>;

export const interviewQuestionCaptionDurationFrames = 150;

export const defaultInterviewQuestionCaptionProps = {
  questionText: "SAMPLE QUESTION TEXT?",

  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontSize: 44,
  letterSpacing: "0.01em",

  textColor: "#ff2d9e",
  outlineColor: "#ffffff",

  footagePlaceholderColor: "#1c1c22",

  verticalPositionPercent: 78,

  popInFrames: 10,
  delayFrames: 0,
} as const;

export const interviewQuestionCaptionPatterns = {
  /** Hot-pink bold question caption over street-interview footage (English default) */
  streetQuestion: {
    ...defaultInterviewQuestionCaptionProps,
    questionText: "SAMPLE QUESTION TEXT?",
  },

  /** Same treatment, Japanese sample copy */
  streetQuestionJp: {
    ...defaultInterviewQuestionCaptionProps,
    questionText: "サンプルの質問文？",
  },
};

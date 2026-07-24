import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const oneTakeLogoSchemaV1 = z.object({
  barColorTop: zColor().default("#EAFEFF"),
  barColorBottom: zColor().default("#37E9FF"),
  backgroundColor: zColor().default("#060810"),

  /** 波が1周するフレーム数（アプリ埋め込み時にシームレスループする前提のため、
   *  コンポジション全体の尺はwavePeriodFrames*motionCyclesBeforeHold+holdFramesと一致させること） */
  wavePeriodFrames: z.number().min(10).default(90),
  /** 各バーの高さの振れ幅（1 = 高さの100%分揺れる） */
  waveAmplitude: z.number().min(0).max(1).default(0.22),
  /** 静止に入るまでに再生する周期の数（例: 2なら2周期分再生してから静止する） */
  motionCyclesBeforeHold: z.number().min(1).default(1),
  /** 指定周期数の再生後、次の再生が始まるまで静止させるフレーム数。
   *  frame=0とframe=wavePeriodFrames*Nの姿勢は数式上一致するため、この間ずっと
   *  frame=0相当の姿勢で止めてもシームレスにループする。 */
  holdFrames: z.number().min(0).default(0),
});

export type OneTakeLogoSchemaV1Type = z.infer<typeof oneTakeLogoSchemaV1>;

import {zColor} from "@remotion/zod-types"; import {z} from "zod";
export const wireframeBuildSchema=z.object({backgroundColor:zColor(),lineColor:zColor(),accentColor:zColor(),columns:z.number().int().min(4).max(30),rows:z.number().int().min(4).max(30),buildFrames:z.number().int().min(10).max(240),depthSpeed:z.number().min(0).max(4),flicker:z.number().min(0).max(1)});
export type WireframeBuildProps=z.infer<typeof wireframeBuildSchema>; export const wireframeBuildDurationFrames=240;
export const defaultWireframeBuildProps={backgroundColor:"#02070d",lineColor:"#20dcff",accentColor:"#b6fff4",columns:16,rows:14,buildFrames:90,depthSpeed:1,flicker:.12} as const;
export const wireframeBuildPatterns:Record<string,WireframeBuildProps>={cityRise:{...defaultWireframeBuildProps},emeraldConstruct:{...defaultWireframeBuildProps,backgroundColor:"#010906",lineColor:"#22ef9b",accentColor:"#ddfff0",columns:20,buildFrames:120,depthSpeed:.65}};

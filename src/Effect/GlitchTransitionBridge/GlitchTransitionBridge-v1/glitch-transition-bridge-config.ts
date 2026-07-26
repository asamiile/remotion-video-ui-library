/**
 * Short transition bridge reproducing two techniques from the HUNTER×HUNTER
 * volume 37 PV analysis (video_analysis/): "RGB-offset (chromatic aberration)
 * glitch + vertical light streaks, used at a single scene transition" and "a
 * brief overlay of a geometric line-art motif". Duration is about 0.5s @
 * 30fps (roughly one cut in the analyzed PV). Meant to be inserted at just one
 * spot between hard cuts — don't overuse it.
 */
export const glitchTransitionBridgeV1DurationFrames = 15;

export const defaultGlitchTransitionBridgeV1Props = {
  backgroundColor: "#060810",

  streakCount: 6,
  streakBaseColor: "#eef1fc",
  channelAColor: "#ff3d9e",
  channelBColor: "#37e9ff",
  streakChannelShiftPx: 4,

  lineArtEnabled: true,
  lineArtColor: "#7c86a8",

  randomSeed: "glitch-bridge-v1",
};

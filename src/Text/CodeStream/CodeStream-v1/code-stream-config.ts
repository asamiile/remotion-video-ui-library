export const defaultCodeStreamHorizontalV1Props = {
	direction: "horizontal",
	paragraphs: [[""]],
	accentEvery: 3,
	speedPxPerFrame: 10,
	gapPx: 96,
	textSize: 28,
	lineHeight: 38,
	letterSpacing: 0.2,
	panelPaddingPx: 40,
	panelRadiusPx: 28,
	backgroundColor: "#05070d",
	primaryColor: "#eef1fc",
	flickerProbability: 0.5,
	flickerWindowMs: 900,
} as const;

export const defaultCodeStreamVerticalV1Props = {
	direction: "vertical",
	paragraphs: [[""]],
	accentEvery: 2,
	speedPxPerFrame: 7,
	gapPx: 36,
	textSize: 26,
	lineHeight: 34,
	letterSpacing: 0.25,
	panelPaddingPx: 36,
	panelRadiusPx: 24,
	backgroundColor: "#05070d",
	primaryColor: "#eef1fc",
	flickerProbability: 0.5,
	flickerWindowMs: 900,
} as const;

export const codeStreamV1Patterns = {
	horizontal: defaultCodeStreamHorizontalV1Props,
	vertical: defaultCodeStreamVerticalV1Props,
} as const;

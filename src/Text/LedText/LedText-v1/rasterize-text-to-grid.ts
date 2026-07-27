export type RasterizeTextToGridOptions = {
  text: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  cellSize: number;
  sampleThreshold: number;
  paddingCells: number;
};

/**
 * Draws text onto a 2D canvas and produces an on/off dot grid based on the
 * brightness sampled at each cell's center. Assumes `document` is available,
 * which holds in Remotion's render environment (Chromium).
 */
export function rasterizeTextToGrid(
  options: RasterizeTextToGridOptions,
): boolean[][] {
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    cellSize,
    sampleThreshold,
    paddingCells,
  } = options;

  if (!text || typeof document === "undefined") {
    return [[false]];
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return [[false]];
  }

  const padPx = paddingCells * cellSize;
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.font = font;

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize * 1.3;
  const contentW = Math.ceil(textWidth + padPx * 2);
  const contentH = Math.ceil(textHeight + padPx * 2);
  const cols = Math.max(1, Math.ceil(contentW / cellSize));
  const rows = Math.max(1, Math.ceil(contentH / cellSize));
  const w = cols * cellSize;
  const h = rows * cellSize;

  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);
  ctx.font = font;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(text, padPx, h / 2);

  const imageData = ctx.getImageData(0, 0, w, h);
  const { data } = imageData;
  const grid: boolean[][] = [];

  for (let gy = 0; gy < rows; gy++) {
    const row: boolean[] = [];
    const cy = Math.min(
      h - 1,
      gy * cellSize + Math.max(0, Math.floor(cellSize / 2)),
    );
    for (let gx = 0; gx < cols; gx++) {
      const cx = Math.min(
        w - 1,
        gx * cellSize + Math.max(0, Math.floor(cellSize / 2)),
      );
      const idx = (cy * w + cx) * 4;
      const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      row.push(lum >= sampleThreshold);
    }
    grid.push(row);
  }

  return grid;
}

/** Display aspect for cap tiles (from authored SVG width/height). */
export const BRUSH_CAP_ASPECT = { width: 58, height: 64 } as const;
export const BRUSH_MIDDLE_TILE_WIDTH = 84;

/** Shared vertical ink bounds (all three pieces align on these Y coords). */
export const BRUSH_INK_BOUNDS = { minY: -6, maxY: 55 } as const;
export const BRUSH_INK_HEIGHT = BRUSH_INK_BOUNDS.maxY - BRUSH_INK_BOUNDS.minY;

export const BRUSH_MIDDLE_TILE_VIEWBOX = `0 ${BRUSH_INK_BOUNDS.minY} ${BRUSH_MIDDLE_TILE_WIDTH} ${BRUSH_INK_HEIGHT}`;

/** Layout seam (cap column width); clip extends past this to hide cap/middle notch. */
export const BRUSH_SEAM_X = 58;
export const BRUSH_LEFT_CAP_CLIP_X = 64;

export const BRUSH_LEFT_CAP_VIEWBOX = `-8 ${BRUSH_INK_BOUNDS.minY} ${BRUSH_LEFT_CAP_CLIP_X + 8} ${BRUSH_INK_HEIGHT}`;

/** Right cap path extent in authored coords (outer edge ≈ x=43). */
export const BRUSH_RIGHT_CAP_INK_MAX_X = 43;
/** Scale path ink to the layout column width ({@link BRUSH_SEAM_X}). */
export const BRUSH_RIGHT_CAP_SCALE = BRUSH_SEAM_X / BRUSH_RIGHT_CAP_INK_MAX_X;
export const BRUSH_RIGHT_CAP_VIEWBOX = `0 ${BRUSH_INK_BOUNDS.minY} ${BRUSH_SEAM_X} ${BRUSH_INK_HEIGHT}`;

export const BRUSH_LEFT_CAP_CLIP = `M -8 ${BRUSH_INK_BOUNDS.minY} H ${BRUSH_LEFT_CAP_CLIP_X} V ${BRUSH_INK_BOUNDS.maxY} H -8 Z`;

export const BRUSH_LEFT_CAP_PATH =
  'M 64 2 C 55 3 55 -2 38 1 C 28 -1 19 0 15 3 C 10 8 13 8 11 11 C 1 7 -6 43 9 49 C 27 55 29 45 40 50 C 46 52 51 49 64 47 Z';

export const BRUSH_RIGHT_CAP_PATH =
  'M 0 1 C 8 3 14 -2 17 6 C 31 4 28 10 29 16 C 32 15 43 21 29 32 C 32 37 30 42 21 46 C 14 48 8 43 0 46 Z';

/** Middle tile — x=0 and x=84 edges share y=1 / y=46 for seamless repeat. */
export const BRUSH_MIDDLE_PATH =
  'M 0 1 C 7 5 13 -1 21 0 C 30 6 36 -1 45 0 C 54 5 61 0 69 0 C 76 5 80 2 84 1 L 84 46 C 78 46 73 51 65 45 C 56 44 50 51 40 45 C 32 45 28 51 16 45 C 9 45 5 50 0 46 Z';

export function getBrushMiddleMaskUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRUSH_MIDDLE_TILE_VIEWBOX}"><path fill="black" d="${BRUSH_MIDDLE_PATH}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

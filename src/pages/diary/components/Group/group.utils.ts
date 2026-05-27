const BRUSH_SIZE = 24;

export function brushesForTitle(title: string): number {
  if (title.length <= 5) return 1;
  if (title.length <= 9) return 2;
  if (title.length <= 13) return 3;
  return 4;
}

export const GROUP_BRUSH_SIZE = BRUSH_SIZE;

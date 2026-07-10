export type SpacedCentersOptions = {
  length: number;
  spacing: number;
  itemRadius: number;
};

export function computeSpacedCenters({
  length,
  spacing,
  itemRadius: r,
}: SpacedCentersOptions): number[] {
  const gap = Math.max(0, spacing - 2 * r);
  const firstCenter = 2 * r + gap;
  const lastCenter = length - 2 * r - gap;
  const centers: number[] = [];

  if (lastCenter >= firstCenter) {
    for (let cy = firstCenter; cy <= lastCenter + 0.001; cy += spacing) {
      centers.push(cy);
    }
  }

  return centers;
}

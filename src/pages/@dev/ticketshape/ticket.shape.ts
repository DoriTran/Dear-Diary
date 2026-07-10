import { BL, BR, ShapePath, TL, TR } from '@/packages/shape';

import type { TicketShapeConfig } from './config';

import { computeNotchLayout, type NotchLayout } from './notch.utils';

function buildScallopedLeftEdge(
  path: ShapePath,
  height: number,
  r: number,
  layout: NotchLayout,
): void {
  const { fullCenters } = layout;

  path.arc({
    rx: r,
    ry: r,
    sweep: false,
    x: 0,
    y: height - r,
  });

  for (let i = fullCenters.length - 1; i >= 0; i -= 1) {
    const cy = fullCenters[i];
    path.lineTo(0, cy + r);
    path.arc({
      rx: r,
      ry: r,
      sweep: false,
      x: 0,
      y: cy - r,
    });
  }

  path.lineTo(0, r);
  path.arc({
    rx: r,
    ry: r,
    sweep: false,
    x: 0,
    y: 0,
  });
}

export function buildTicketPath(
  width: number,
  height: number,
  config: TicketShapeConfig,
): string {
  const { borderRadius: br, notchRadius: r } = config;
  const layout = computeNotchLayout(height, config);
  const path = new ShapePath({ width, height });

  path
    .move(TL)
    .lineTo(TR.offsetX(-br))
    .corner(TR, br)
    .lineTo(BR.offsetY(-br))
    .corner(BR, br)
    .lineTo(BL);

  buildScallopedLeftEdge(path, height, r, layout);

  return path.close().toSVG();
}

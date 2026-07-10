import {
  BL,
  BR,
  computeSpacedCenters,
  ShapePath,
  TL,
  TR,
} from '@/packages/shape';

import type { TicketDecoratorConfig } from './ticket.config';

export function buildTicketStubPath(
  width: number,
  height: number,
  config: TicketDecoratorConfig,
): string {
  const { borderRadius: br, notchRadius: r, notchSpacing } = config;
  const path = new ShapePath({ width, height });

  const notchCenters = computeSpacedCenters({
    length: height,
    spacing: notchSpacing,
    itemRadius: r,
  });

  path
    .move(TL.offsetX(br))
    .lineTo(TR.offsetX(-br))
    .corner(TR, br)
    .lineTo(BR.offsetY(-br))
    .corner(BR, br)
    .lineTo(BL.offsetX(br))
    .corner(BL, br);

  for (let i = notchCenters.length - 1; i >= 0; i -= 1) {
    const cy = notchCenters[i];
    path.lineTo(0, cy + r);
    path.arc({
      rx: r,
      ry: r,
      sweep: false,
      x: 0,
      y: cy - r,
    });
  }

  path.lineTo(TL.offsetY(br)).corner(TL, br);

  return path.close().toSVG();
}

export function getStubTearLineX(width: number): number {
  return width;
}

export function svgViewBoxAttr(
  width: number,
  height: number,
  config: TicketDecoratorConfig,
): string {
  const pad = config.notchRadius;
  return `${-pad} 0 ${width + pad} ${height}`;
}

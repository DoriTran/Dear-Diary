import { BL, BR, ShapePath, TL, TR } from '@/packages/shape';

import type { TicketDecoratorConfig } from './ticket.config';

export type TicketStubVariant = 'standard' | 'compact';

function resolveNotchRadius(
  config: TicketDecoratorConfig,
  variant: TicketStubVariant,
): number {
  return variant === 'compact' ? config.compactNotchRadius : config.notchRadius;
}

function resolveBorderRadius(
  config: TicketDecoratorConfig,
  variant: TicketStubVariant,
): number {
  return variant === 'compact'
    ? config.compactBorderRadius
    : config.borderRadius;
}

function computeCenteredNotchCenters(
  height: number,
  spacing: number,
  r: number,
  br: number,
): number[] {
  const minY = br + r;
  const maxY = height - br - r;

  if (maxY < minY) {
    return [];
  }

  let count = 1;
  while (true) {
    const nextCount = count + 1;
    const halfSpan = ((nextCount - 1) / 2) * spacing;
    const clusterTop = height / 2 - halfSpan - r;
    const clusterBottom = height / 2 + halfSpan + r;

    if (clusterTop >= minY && clusterBottom <= maxY) {
      count = nextCount;
    } else {
      break;
    }
  }

  return Array.from(
    { length: count },
    (_, index) => height / 2 + (index - (count - 1) / 2) * spacing,
  );
}

function appendLeftNotches(
  path: ShapePath,
  height: number,
  r: number,
  variant: TicketStubVariant,
  notchSpacing: number,
  br: number,
): void {
  if (variant === 'compact') {
    const cy = height / 2;
    path.lineTo(0, cy + r);
    path.arc({
      rx: r,
      ry: r,
      sweep: false,
      x: 0,
      y: cy - r,
    });
    return;
  }

  const notchCenters = computeCenteredNotchCenters(height, notchSpacing, r, br);

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
}

export function buildTicketStubPath(
  width: number,
  height: number,
  config: TicketDecoratorConfig,
  variant: TicketStubVariant = 'standard',
): string {
  const br = resolveBorderRadius(config, variant);
  const r = resolveNotchRadius(config, variant);
  const path = new ShapePath({ width, height });

  path
    .move(TL.offsetX(br))
    .lineTo(TR.offsetX(-br))
    .corner(TR, br)
    .lineTo(BR.offsetY(-br))
    .corner(BR, br)
    .lineTo(BL.offsetX(br))
    .corner(BL, br);

  appendLeftNotches(path, height, r, variant, config.notchSpacing, br);

  path.lineTo(TL.offsetY(br)).corner(TL, br);

  return path.close().toSVG();
}

export function resolveTicketStubVariant(
  surfaceHeight: number,
  config: TicketDecoratorConfig,
): TicketStubVariant {
  return surfaceHeight < config.compactHeightThreshold ? 'compact' : 'standard';
}

export function svgViewBoxAttr(
  width: number,
  height: number,
  config: TicketDecoratorConfig,
  variant: TicketStubVariant = 'standard',
): string {
  const pad = resolveNotchRadius(config, variant);
  return `${-pad} 0 ${width + pad} ${height}`;
}

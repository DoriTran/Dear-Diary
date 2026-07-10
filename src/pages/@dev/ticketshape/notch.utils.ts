import { computeSpacedCenters } from '@/packages/shape';

import type { TicketShapeConfig } from './config';

export type NotchLayout = {
  fullCenters: number[];
  fullCount: number;
  gap: number;
  count: number;
};

export function computeNotchLayout(
  height: number,
  config: TicketShapeConfig,
): NotchLayout {
  const { notchRadius: r, notchSpacing } = config;
  const gap = Math.max(0, notchSpacing - 2 * r);
  const fullCenters = computeSpacedCenters({
    length: height,
    spacing: notchSpacing,
    itemRadius: r,
  });

  return {
    fullCenters,
    fullCount: fullCenters.length,
    gap,
    count: fullCenters.length + 2,
  };
}

export function getTearLineX(width: number, config: TicketShapeConfig): number {
  return width - config.tearOffset;
}

export function getTiltTransform(
  width: number,
  height: number,
  config: TicketShapeConfig,
): string {
  if (config.tiltDeg === 0) return '';
  return `rotate(${config.tiltDeg} ${width / 2} ${height / 2})`;
}

export function svgViewBoxAttr(
  width: number,
  height: number,
  config: TicketShapeConfig,
): string {
  const pad = config.notchRadius;
  return `${-pad} 0 ${width + pad} ${height}`;
}

export function formatNotchDebugLabel(layout: NotchLayout): string {
  if (layout.fullCount === 0) {
    return `½ + ½ · gap ${layout.gap}px`;
  }
  return `½ + ${layout.fullCount} full + ½ · gap ${layout.gap}px`;
}

export { buildTicketPath } from './ticket.shape';

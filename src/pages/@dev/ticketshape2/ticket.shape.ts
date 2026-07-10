import {
  BL,
  BR,
  computeSpacedCenters,
  ShapePath,
  TL,
  TR,
} from '@/packages/shape';

import type { TicketShape2Config } from './config';

/**
 * Movie-style ticket: four arc corners + left-edge punch notches via ShapePath.
 * Built to showcase the DSL (anchors, corner(), arc, spaced centers).
 */
export function buildTicket2Path(
  width: number,
  height: number,
  config: TicketShape2Config,
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

  // Left edge, bottom → top: outward semicircle punches
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

export function getTearLineX(
  width: number,
  config: TicketShape2Config,
): number {
  return width - config.tearOffset;
}

export function getTiltTransform(config: TicketShape2Config): string {
  if (config.tiltDeg === 0) return '';
  return `rotate(${config.tiltDeg}deg)`;
}

export function svgViewBoxAttr(
  width: number,
  height: number,
  config: TicketShape2Config,
): string {
  const pad = config.notchRadius;
  return `${-pad} 0 ${width + pad} ${height}`;
}

export function formatNotchDebugLabel(
  height: number,
  config: TicketShape2Config,
): string {
  const centers = computeSpacedCenters({
    length: height,
    spacing: config.notchSpacing,
    itemRadius: config.notchRadius,
  });
  const gap = Math.max(0, config.notchSpacing - 2 * config.notchRadius);
  if (centers.length === 0) {
    return `4 corners · 0 notches · gap ${gap}px`;
  }
  return `4 corners · ${centers.length} notches · gap ${gap}px`;
}

import type { AnchorRef } from './coords/anchors';
import type { PathCommand, ResolveContext } from './types';

import { resolvePoint } from './coords/resolve';

export function buildCornerArc(
  anchor: AnchorRef,
  radius: number,
  ctx: ResolveContext,
): PathCommand {
  const corner = resolvePoint(anchor, anchor, ctx);

  let arcEndX = corner.x;
  let arcEndY = corner.y;
  let sweep = false;

  switch (anchor.id) {
    case 'TR':
      arcEndX = corner.x;
      arcEndY = corner.y + radius;
      sweep = false;
      break;
    case 'BR':
      arcEndX = corner.x - radius;
      arcEndY = corner.y;
      sweep = false;
      break;
    case 'BL':
      arcEndX = corner.x;
      arcEndY = corner.y - radius;
      sweep = false;
      break;
    case 'TL':
      arcEndX = corner.x + radius;
      arcEndY = corner.y;
      sweep = false;
      break;
    default:
      throw new Error(
        `corner() only supports corner anchors, got ${anchor.id}`,
      );
  }

  return {
    type: 'A',
    rx: radius,
    ry: radius,
    rotation: 0,
    largeArc: false,
    sweep,
    x: arcEndX,
    y: arcEndY,
  };
}

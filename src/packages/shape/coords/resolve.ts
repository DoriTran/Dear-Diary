import type { Coord, ResolveContext } from '../types';
import type { AnchorId, AnchorRef } from './anchors';

function anchorBase(
  id: AnchorId,
  ctx: ResolveContext,
): { x: number; y: number } {
  const { width, height } = ctx;

  switch (id) {
    case 'TL':
      return { x: 0, y: 0 };
    case 'TC':
      return { x: width / 2, y: 0 };
    case 'TR':
      return { x: width, y: 0 };
    case 'CL':
      return { x: 0, y: height / 2 };
    case 'CC':
      return { x: width / 2, y: height / 2 };
    case 'CR':
      return { x: width, y: height / 2 };
    case 'BL':
      return { x: 0, y: height };
    case 'BC':
      return { x: width / 2, y: height };
    case 'BR':
      return { x: width, y: height };
  }
}

function resolveAnchor(
  anchor: AnchorRef,
  ctx: ResolveContext,
): { x: number; y: number } {
  const base = anchorBase(anchor.id, ctx);
  return {
    x: base.x + anchor.xOffset,
    y: base.y + anchor.yOffset,
  };
}

export function resolveCoord(
  coord: Coord,
  ctx: ResolveContext,
  axis: 'x' | 'y',
): number {
  if (typeof coord === 'number') {
    return coord;
  }

  switch (coord.kind) {
    case 'px':
      return coord.value;
    case 'percent':
      return (coord.value / 100) * (axis === 'x' ? ctx.width : ctx.height);
    case 'anchor':
      return resolveAnchor(coord, ctx)[axis];
    case 'current': {
      if (coord.axis === 'x') return ctx.currentX;
      if (coord.axis === 'y') return ctx.currentY;
      return axis === 'x' ? ctx.currentX : ctx.currentY;
    }
    case 'expr': {
      const left = resolveCoord(coord.left, ctx, axis);
      const right =
        typeof coord.right === 'number'
          ? coord.right
          : resolveCoord(coord.right, ctx, axis);
      return coord.op === 'plus' ? left + right : left - right;
    }
  }
}

export function resolvePoint(
  x: Coord,
  y: Coord,
  ctx: ResolveContext,
): { x: number; y: number } {
  return {
    x: resolveCoord(x, ctx, 'x'),
    y: resolveCoord(y, ctx, 'y'),
  };
}

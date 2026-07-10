import type {
  ArcOptions,
  Coord,
  CubicOptions,
  PathCommand,
  QuadraticOptions,
  ResolveContext,
} from './types';

import { resolveCoord, resolvePoint } from './coords/resolve';

export function resolveX(coord: Coord, ctx: ResolveContext): number {
  return resolveCoord(coord, ctx, 'x');
}

export function resolveY(coord: Coord, ctx: ResolveContext): number {
  return resolveCoord(coord, ctx, 'y');
}

export function resolveArcOptions(
  options: ArcOptions,
  ctx: ResolveContext,
): Extract<PathCommand, { type: 'A' }> {
  const point = resolvePoint(options.x, options.y, ctx);
  return {
    type: 'A',
    rx: options.rx,
    ry: options.ry,
    rotation: options.rotation ?? 0,
    largeArc: options.largeArc ?? false,
    sweep: options.sweep ?? false,
    x: point.x,
    y: point.y,
  };
}

export function resolveQuadraticOptions(
  options: QuadraticOptions,
  ctx: ResolveContext,
): Extract<PathCommand, { type: 'Q' }> {
  const control = resolvePoint(options.cx, options.cy, ctx);
  const end = resolvePoint(options.x, options.y, ctx);
  return {
    type: 'Q',
    cx: control.x,
    cy: control.y,
    x: end.x,
    y: end.y,
  };
}

export function resolveCubicOptions(
  options: CubicOptions,
  ctx: ResolveContext,
): Extract<PathCommand, { type: 'C' }> {
  const c1 = resolvePoint(options.c1x, options.c1y, ctx);
  const c2 = resolvePoint(options.c2x, options.c2y, ctx);
  const end = resolvePoint(options.x, options.y, ctx);
  return {
    type: 'C',
    c1x: c1.x,
    c1y: c1.y,
    c2x: c2.x,
    c2y: c2.y,
    x: end.x,
    y: end.y,
  };
}

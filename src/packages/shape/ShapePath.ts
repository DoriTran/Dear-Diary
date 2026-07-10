import type { AnchorRef } from './coords/anchors';
import type {
  ArcOptions,
  Bounds,
  Coord,
  CubicOptions,
  PathCommand,
  QuadraticOptions,
  RepeatAxisOptions,
  RepeatOptions,
  ResolveContext,
} from './types';

import {
  resolveArcOptions,
  resolveCubicOptions,
  resolveQuadraticOptions,
  resolveX,
  resolveY,
} from './commands';
import { resolveCoord, resolvePoint } from './coords/resolve';
import { buildCornerArc } from './corner';
import { serializeCommands } from './serialize';

export class ShapePath {
  readonly width: number;
  readonly height: number;

  private commands: PathCommand[] = [];
  private currentX = 0;
  private currentY = 0;

  constructor(bounds: Bounds) {
    this.width = bounds.width;
    this.height = bounds.height;
  }

  getContext(): ResolveContext {
    return {
      width: this.width,
      height: this.height,
      currentX: this.currentX,
      currentY: this.currentY,
    };
  }

  toCommands(): PathCommand[] {
    return [...this.commands];
  }

  toSVG(): string {
    return serializeCommands(this.commands);
  }

  private isAnchorPoint(value: Coord): value is AnchorRef {
    return (
      typeof value === 'object' &&
      value !== null &&
      'kind' in value &&
      value.kind === 'anchor'
    );
  }

  private resolvePointArg(x: Coord, y?: Coord): { x: number; y: number } {
    const ctx = this.getContext();
    if (y === undefined && this.isAnchorPoint(x)) {
      return resolvePoint(x, x, ctx);
    }
    return resolvePoint(x, y ?? x, ctx);
  }

  move(x: Coord, y?: Coord): this {
    const point = this.resolvePointArg(x, y);
    this.commands.push({ type: 'M', x: point.x, y: point.y });
    this.currentX = point.x;
    this.currentY = point.y;
    return this;
  }

  lineTo(x: Coord, y?: Coord): this {
    const point = this.resolvePointArg(x, y);
    this.commands.push({ type: 'L', x: point.x, y: point.y });
    this.currentX = point.x;
    this.currentY = point.y;
    return this;
  }

  horizontalTo(x: Coord): this {
    const ctx = this.getContext();
    const resolvedX = resolveX(x, ctx);
    this.commands.push({ type: 'H', x: resolvedX });
    this.currentX = resolvedX;
    return this;
  }

  verticalTo(y: Coord): this {
    const ctx = this.getContext();
    const resolvedY = resolveY(y, ctx);
    this.commands.push({ type: 'V', y: resolvedY });
    this.currentY = resolvedY;
    return this;
  }

  arc(options: ArcOptions): this {
    const ctx = this.getContext();
    const command = resolveArcOptions(options, ctx);
    this.commands.push(command);
    this.currentX = command.x;
    this.currentY = command.y;
    return this;
  }

  quadratic(options: QuadraticOptions): this {
    const ctx = this.getContext();
    const command = resolveQuadraticOptions(options, ctx);
    this.commands.push(command);
    this.currentX = command.x;
    this.currentY = command.y;
    return this;
  }

  cubic(options: CubicOptions): this {
    const ctx = this.getContext();
    const command = resolveCubicOptions(options, ctx);
    this.commands.push(command);
    this.currentX = command.x;
    this.currentY = command.y;
    return this;
  }

  corner(anchor: AnchorRef, radius: number): this {
    const ctx = this.getContext();
    const command = buildCornerArc(anchor, radius, ctx);
    this.commands.push(command);
    if (command.type === 'A') {
      this.currentX = command.x;
      this.currentY = command.y;
    }
    return this;
  }

  close(): this {
    this.commands.push({ type: 'Z' });
    return this;
  }

  repeatY(
    options: RepeatAxisOptions,
    callback: (y: number, index: number, path: ShapePath) => void,
  ): this {
    const ctx = this.getContext();
    const fromY = resolveY(options.from, ctx);
    const toY = resolveY(options.to, ctx);
    let index = 0;

    for (let y = fromY; y <= toY + 0.001; y += options.spacing) {
      callback(y, index, this);
      index += 1;
    }

    return this;
  }

  repeatX(
    options: RepeatAxisOptions,
    callback: (x: number, index: number, path: ShapePath) => void,
  ): this {
    const ctx = this.getContext();
    const fromX = resolveX(options.from, ctx);
    const toX = resolveX(options.to, ctx);
    let index = 0;

    for (let x = fromX; x <= toX + 0.001; x += options.spacing) {
      callback(x, index, this);
      index += 1;
    }

    return this;
  }

  repeat(
    options: RepeatOptions,
    callback: (value: number, index: number, path: ShapePath) => void,
  ): this {
    for (let i = 0; i < options.count; i += 1) {
      callback(options.start + i * options.step, i, this);
    }
    return this;
  }

  /** Resolve a coordinate on the X axis using the current cursor context. */
  resolveX(coord: Coord): number {
    return resolveCoord(coord, this.getContext(), 'x');
  }

  /** Resolve a coordinate on the Y axis using the current cursor context. */
  resolveY(coord: Coord): number {
    return resolveCoord(coord, this.getContext(), 'y');
  }
}

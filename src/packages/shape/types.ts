import type { AnchorRef } from './coords/anchors';
import type { CurrentRef } from './coords/current';
import type { CoordExpr } from './coords/expressions';
import type { Percent, Px } from './coords/primitives';

export type Coord = number | Px | Percent | AnchorRef | CurrentRef | CoordExpr;

export type Bounds = {
  width: number;
  height: number;
};

export type ResolveContext = Bounds & {
  currentX: number;
  currentY: number;
};

export type MoveCommand = { type: 'M'; x: number; y: number };
export type LineCommand = { type: 'L'; x: number; y: number };
export type HorizontalCommand = { type: 'H'; x: number };
export type VerticalCommand = { type: 'V'; y: number };
export type ArcCommand = {
  type: 'A';
  rx: number;
  ry: number;
  rotation: number;
  largeArc: boolean;
  sweep: boolean;
  x: number;
  y: number;
};
export type QuadraticCommand = {
  type: 'Q';
  cx: number;
  cy: number;
  x: number;
  y: number;
};
export type CubicCommand = {
  type: 'C';
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  x: number;
  y: number;
};
export type CloseCommand = { type: 'Z' };

export type PathCommand =
  | MoveCommand
  | LineCommand
  | HorizontalCommand
  | VerticalCommand
  | ArcCommand
  | QuadraticCommand
  | CubicCommand
  | CloseCommand;

export type ArcOptions = {
  rx: number;
  ry: number;
  rotation?: number;
  largeArc?: boolean;
  sweep?: boolean;
  x: Coord;
  y: Coord;
};

export type QuadraticOptions = {
  cx: Coord;
  cy: Coord;
  x: Coord;
  y: Coord;
};

export type CubicOptions = {
  c1x: Coord;
  c1y: Coord;
  c2x: Coord;
  c2y: Coord;
  x: Coord;
  y: Coord;
};

export type RepeatAxisOptions = {
  from: Coord;
  to: Coord;
  spacing: number;
};

export type RepeatOptions = {
  count: number;
  start: number;
  step: number;
};

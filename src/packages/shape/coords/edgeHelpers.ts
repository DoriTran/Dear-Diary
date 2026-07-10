import type { Coord } from '../types';

import { percent, px } from './primitives';

export function left(inset = 0): Coord {
  return inset === 0 ? px(0) : px(inset);
}

export function right(inset = 0): Coord {
  return inset === 0 ? percent(100) : percent(100).minus(inset);
}

export function top(inset = 0): Coord {
  return inset === 0 ? px(0) : px(inset);
}

export function bottom(inset = 0): Coord {
  return inset === 0 ? percent(100) : percent(100).minus(inset);
}

export function center(): Coord {
  return percent(50);
}

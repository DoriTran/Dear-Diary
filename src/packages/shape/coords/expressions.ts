import type { Coord } from '../types';

export type ExprOp = 'plus' | 'minus';

export class CoordExpr {
  readonly kind = 'expr' as const;
  readonly op: ExprOp;
  readonly left: Coord;
  readonly right: number | Coord;

  constructor(op: ExprOp, left: Coord, right: number | Coord) {
    this.op = op;
    this.left = left;
    this.right = right;
  }
}

export function plus(left: Coord, right: number | Coord): CoordExpr {
  return new CoordExpr('plus', left, right);
}

export function minus(left: Coord, right: number | Coord): CoordExpr {
  return new CoordExpr('minus', left, right);
}

export type ExprCapable = {
  plus(delta: number | Coord): CoordExpr;
  minus(delta: number | Coord): CoordExpr;
};

export function withExpressions<T extends Coord>(coord: T): T & ExprCapable {
  return Object.assign(coord, {
    plus(delta: number | Coord) {
      return new CoordExpr('plus', coord, delta);
    },
    minus(delta: number | Coord) {
      return new CoordExpr('minus', coord, delta);
    },
  });
}

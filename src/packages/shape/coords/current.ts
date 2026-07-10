import { withExpressions } from './expressions';

export class CurrentRef {
  readonly kind = 'current' as const;
  readonly axis?: 'x' | 'y';

  constructor(axis?: 'x' | 'y') {
    this.axis = axis;
  }
}

function currentRef(axis?: 'x' | 'y') {
  return withExpressions(new CurrentRef(axis));
}

export const Current = currentRef();
export const CurrentX = currentRef('x');
export const CurrentY = currentRef('y');

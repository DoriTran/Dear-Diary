import { withExpressions } from './expressions';

export class Px {
  readonly kind = 'px' as const;
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }
}

export class Percent {
  readonly kind = 'percent' as const;
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }
}

export function px(value: number): Px & ReturnType<typeof withExpressions<Px>> {
  return withExpressions(new Px(value));
}

export function percent(
  value: number,
): Percent & ReturnType<typeof withExpressions<Percent>> {
  return withExpressions(new Percent(value));
}

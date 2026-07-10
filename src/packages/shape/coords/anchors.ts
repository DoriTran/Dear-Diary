import { withExpressions } from './expressions';

export type AnchorId =
  | 'TL'
  | 'TC'
  | 'TR'
  | 'CL'
  | 'CC'
  | 'CR'
  | 'BL'
  | 'BC'
  | 'BR';

export class AnchorRef {
  readonly kind = 'anchor' as const;
  readonly id: AnchorId;
  readonly xOffset: number;
  readonly yOffset: number;

  constructor(id: AnchorId, xOffset = 0, yOffset = 0) {
    this.id = id;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }

  offsetX(
    delta: number,
  ): AnchorRef & ReturnType<typeof withExpressions<AnchorRef>> {
    return withExpressions(
      new AnchorRef(this.id, this.xOffset + delta, this.yOffset),
    );
  }

  offsetY(
    delta: number,
  ): AnchorRef & ReturnType<typeof withExpressions<AnchorRef>> {
    return withExpressions(
      new AnchorRef(this.id, this.xOffset, this.yOffset + delta),
    );
  }

  offset(
    dx: number,
    dy: number,
  ): AnchorRef & ReturnType<typeof withExpressions<AnchorRef>> {
    return withExpressions(
      new AnchorRef(this.id, this.xOffset + dx, this.yOffset + dy),
    );
  }
}

function anchor(id: AnchorId) {
  return withExpressions(new AnchorRef(id));
}

export const TL = anchor('TL');
export const TC = anchor('TC');
export const TR = anchor('TR');
export const CL = anchor('CL');
export const CC = anchor('CC');
export const CR = anchor('CR');
export const BL = anchor('BL');
export const BC = anchor('BC');
export const BR = anchor('BR');

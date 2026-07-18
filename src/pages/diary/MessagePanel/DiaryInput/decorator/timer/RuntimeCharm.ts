import type { Charm } from '../charms/charm.types';

import { isTimerDecorator, tickTimerDecorator } from './timer.utils';

export const createRuntimeCharm = (): Charm => ({
  id: 'timer-runtime',
  region: 'overlay',
  order: 0,
  runtime: {
    decoratorType: 'timer',
    shouldTick: (ctx, decoration) => {
      if (!isTimerDecorator(decoration)) {
        return false;
      }

      if (ctx.composing) {
        return false;
      }

      if (decoration.mode === 'datetime') {
        return true;
      }

      return decoration.running && !decoration.pause;
    },
    tick: (decoration, now) => {
      if (!isTimerDecorator(decoration)) {
        return decoration;
      }

      return tickTimerDecorator(decoration, now);
    },
  },
});

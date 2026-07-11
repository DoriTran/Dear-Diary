import type { Charm } from '../charms/charm.types';

import TimerModeDatetime from './TimerModeDatetime';

export const createTimerModeDatetimeCharm = (
  decoratorIndex: number,
): Charm => ({
  id: 'timer-mode-datetime',
  region: 'top',
  order: 3,
  elements: [
    {
      region: 'top',
      order: 3,
      render: (ctx) => {
        const decoration = ctx.decorators[decoratorIndex];
        if (!decoration || decoration.type !== 'timer') {
          return null;
        }

        if (decoration.mode !== 'datetime') {
          return null;
        }

        return (
          <TimerModeDatetime
            decoration={decoration}
            decoratorIndex={decoratorIndex}
            ctx={ctx}
          />
        );
      },
    },
  ],
});

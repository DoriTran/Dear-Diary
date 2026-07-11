import type { Charm } from '../charms/charm.types';

import TimerModeTimer from './TimerModeTimer';

export const createTimerModeTimerCharm = (decoratorIndex: number): Charm => ({
  id: 'timer-mode-timer',
  region: 'top',
  order: 1,
  elements: [
    {
      region: 'top',
      order: 1,
      render: (ctx) => {
        const decoration = ctx.decorators[decoratorIndex];
        if (!decoration || decoration.type !== 'timer') {
          return null;
        }

        if (decoration.mode !== 'timer') {
          return null;
        }

        return (
          <TimerModeTimer
            decoration={decoration}
            decoratorIndex={decoratorIndex}
            ctx={ctx}
          />
        );
      },
    },
  ],
});

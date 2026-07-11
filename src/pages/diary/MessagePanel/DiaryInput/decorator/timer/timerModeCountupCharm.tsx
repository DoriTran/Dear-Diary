import type { Charm } from '../charms/charm.types';

import TimerModeCountup from './TimerModeCountup';

export const createTimerModeCountupCharm = (decoratorIndex: number): Charm => ({
  id: 'timer-mode-countup',
  region: 'top',
  order: 2,
  elements: [
    {
      region: 'top',
      order: 2,
      render: (ctx) => {
        const decoration = ctx.decorators[decoratorIndex];
        if (!decoration || decoration.type !== 'timer') {
          return null;
        }

        if (decoration.mode !== 'countup') {
          return null;
        }

        return <TimerModeCountup decoration={decoration} ctx={ctx} />;
      },
    },
  ],
});

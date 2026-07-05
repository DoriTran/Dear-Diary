import type { Charm } from '../charms/charm.types';

import TimerModeSelect from './TimerModeSelect';

export const createModeCharm = (decoratorIndex: number): Charm => ({
  id: 'timer-mode',
  region: 'top',
  order: 2,
  elements: [
    {
      region: 'top',
      order: 2,
      render: (ctx) => (
        <TimerModeSelect decoratorIndex={decoratorIndex} ctx={ctx} />
      ),
    },
  ],
});

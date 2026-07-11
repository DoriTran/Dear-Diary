import type { Charm } from '../charms/charm.types';

import TimerControls from './TimerControls';

export const createControlsCharm = (): Charm => ({
  id: 'timer-controls',
  region: 'top',
  order: 5,
  elements: [
    {
      region: 'top',
      order: 5,
      render: (ctx) => <TimerControls ctx={ctx} />,
    },
  ],
});

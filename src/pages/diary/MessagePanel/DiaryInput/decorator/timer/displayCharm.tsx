import type { Charm } from '../charms/charm.types';

import TimerDisplay from './TimerDisplay';

export const createDisplayCharm = (decoratorIndex: number): Charm => ({
  id: 'timer-display',
  region: 'top',
  order: 1,
  styles: [
    {
      target: 'top',
      priority: 50,
      styles: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        background:
          'color-mix(in srgb, var(--primary-light) 30%, var(--surface))',
      },
    },
  ],
  elements: [
    {
      region: 'top',
      order: 1,
      render: (ctx) => {
        const decoration = ctx.decorators[decoratorIndex];
        if (!decoration || decoration.type !== 'timer') {
          return null;
        }

        return (
          <TimerDisplay
            decoration={decoration}
            decoratorIndex={decoratorIndex}
            ctx={ctx}
          />
        );
      },
    },
  ],
});

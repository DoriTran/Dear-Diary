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
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.55rem 0.75rem',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        background: 'color-mix(in srgb, #93c5fd 35%, var(--surface))',
        border: '1px solid color-mix(in srgb, #3b82f6 25%, var(--border-soft))',
        borderBottom: 'none',
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

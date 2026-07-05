import type { Charm } from '../charms/charm.types';

import TicketTear from './TicketTear';

export const createTicketTearCharm = (decoratorIndex: number): Charm => ({
  id: 'ticket-tear',
  region: 'left',
  order: 1,
  styles: [
    {
      target: 'left',
      priority: 100,
      styles: {
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '4.5rem',
        padding: '0.5rem',
        background: 'color-mix(in srgb, #fed7aa 65%, var(--surface))',
        borderRight:
          '2px dashed color-mix(in srgb, #f97316 50%, var(--border-soft))',
        maskImage:
          'radial-gradient(circle at 0 50%, transparent 6px, black 6px)',
        WebkitMaskImage:
          'radial-gradient(circle at 0 50%, transparent 6px, black 6px)',
      },
    },
  ],
  elements: [
    {
      region: 'left',
      order: 1,
      render: (ctx) => <TicketTear decoratorIndex={decoratorIndex} ctx={ctx} />,
    },
  ],
});

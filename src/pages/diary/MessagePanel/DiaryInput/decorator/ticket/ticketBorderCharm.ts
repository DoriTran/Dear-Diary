import type { Charm } from '../charms/charm.types';

export const createTicketBorderCharm = (): Charm => ({
  id: 'ticket-border',
  region: 'container',
  order: 0,
  styles: [
    {
      target: 'container',
      priority: 100,
      styles: {
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        border:
          '2px dashed color-mix(in srgb, var(--primary) 70%, var(--border-soft))',
        background:
          'color-mix(in srgb, var(--primary-light) 40%, var(--surface))',
      },
    },
  ],
});

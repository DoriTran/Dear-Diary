import type { Charm, CharmPlacement } from '../charms/charm.types';

import { TICKET_DECORATOR_CONFIG } from './ticket.config';
import TicketStub from './TicketStub';

export const createTicketStubCharm = (
  decoratorIndex: number,
  placement: CharmPlacement,
): Charm => ({
  id: 'ticket-stub',
  region: 'left',
  order: 0,
  placement,
  styles: [
    {
      target: 'left',
      priority: 100,
      styles: {
        position: 'relative',
        display: 'flex',
        flexShrink: 0,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${TICKET_DECORATOR_CONFIG.tearControlWidth}px`,
        marginRight: '2px',
        overflow: 'visible',
      },
    },
  ],
  elements: [
    {
      region: 'left',
      order: 0,
      render: (ctx) => (
        <TicketStub decoratorIndex={decoratorIndex} ctx={ctx} />
      ),
    },
  ],
});

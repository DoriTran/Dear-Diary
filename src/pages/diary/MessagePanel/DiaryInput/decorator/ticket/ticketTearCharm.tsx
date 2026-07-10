import type { Charm, CharmPlacement } from '../charms/charm.types';

import styles from './ticketCharms.module.css';
import TicketTear from './TicketTear';

export const createTicketTearCharm = (
  decoratorIndex: number,
  placement: CharmPlacement,
): Charm => ({
  id: 'ticket-tear',
  region: 'left',
  order: 1,
  placement,
  elements: [
    {
      region: 'left',
      order: 1,
      render: (ctx) => (
        <div className={styles.tearWrap}>
          <TicketTear decoratorIndex={decoratorIndex} ctx={ctx} />
        </div>
      ),
    },
  ],
});

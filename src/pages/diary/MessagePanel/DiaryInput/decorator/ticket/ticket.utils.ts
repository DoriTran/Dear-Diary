import type { TicketDecorator } from '@/store/diary/type';

import type { CharmPlacement } from '../charms/charm.types';

export const getTicketPlacement = (
  decoration: TicketDecorator,
): CharmPlacement => decoration.placement ?? 'outside';

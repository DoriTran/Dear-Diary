import type {
  ComposerContext,
  DecoratorDefinition,
} from '../charms/charm.types';

import { findDecoratorIndex } from '../charms/decoratorIndex';
import { getTicketPlacement } from './ticket.utils';
import { createTicketBorderCharm } from './ticketBorderCharm';
import { createTicketShapeCharm } from './ticketShapeCharm.tsx';
import { createTicketTearCharm } from './ticketTearCharm.tsx';

export const ticketDecorator: DecoratorDefinition = {
  createCharms: (decoration, decoratorIndex) => {
    if (decoration.type !== 'ticket') {
      return [];
    }

    const placement = getTicketPlacement(decoration);

    return [
      createTicketBorderCharm(),
      createTicketShapeCharm(placement),
      createTicketTearCharm(decoratorIndex, placement),
    ];
  },
  handleEvent: {
    complete: (ctx, decoratorIndex) => {
      const decoration = ctx.decorators[decoratorIndex];
      if (decoration?.type !== 'ticket') {
        return;
      }

      const isDone = decoration.state === 'done';
      ctx.updateDecorator(decoratorIndex, {
        ...decoration,
        state: isDone ? 'todo' : 'done',
        ticked: !isDone,
      });
    },
  },
};

export const handleTicketDecoratorEvent = (
  ctx: ComposerContext,
  event: { action: string },
): void => {
  const index = findDecoratorIndex(ctx.decorators, 'ticket');
  if (index < 0 || !ticketDecorator.handleEvent) {
    return;
  }

  const handler = ticketDecorator.handleEvent[event.action];
  if (handler) {
    handler(ctx, index, ctx.decorators[index]);
  }
};

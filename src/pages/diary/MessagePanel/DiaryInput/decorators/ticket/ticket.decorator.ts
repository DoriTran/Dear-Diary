import type {
  ComposerContext,
  DecoratorDefinition,
} from '../../charms/charm.types';

import { findDecoratorIndex } from '../../charms/useDecoratorRuntime';
import { createTicketBorderCharm } from './ticketBorderCharm';
import { createTicketTearCharm } from './ticketTearCharm';

export const ticketDecorator: DecoratorDefinition = {
  createCharms: (_decoration, decoratorIndex) => [
    createTicketBorderCharm(),
    createTicketTearCharm(decoratorIndex),
  ],
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

import type { MessageDecorator } from '@/store/diary/type';

import type {
  ComposerContext,
  ComposerEvent,
  DecoratorDefinition,
} from '../charms/charm.types';

import { findDecoratorIndex } from '../charms/useDecoratorRuntime';
import { timerDecorator } from './timer/timer.decorator';
import { ticketDecorator } from './ticket/ticket.decorator';

const registry: Record<MessageDecorator['type'], DecoratorDefinition> = {
  ticket: ticketDecorator,
  timer: timerDecorator,
};

export const getDecoratorDefinition = (
  type: MessageDecorator['type'],
): DecoratorDefinition | undefined => registry[type];

export const handleDecoratorEvent = (
  event: ComposerEvent,
  ctx: ComposerContext,
): void => {
  const definition = getDecoratorDefinition(event.decorator);
  if (!definition?.handleEvent) {
    return;
  }

  const decoratorIndex = findDecoratorIndex(ctx.decorators, event.decorator);
  if (decoratorIndex < 0) {
    return;
  }

  const handler = definition.handleEvent[event.action];
  if (!handler) {
    return;
  }

  handler(ctx, decoratorIndex, ctx.decorators[decoratorIndex], event.payload);
};

import type { MessageDecorator } from '@/store/diary/type';

export const findDecoratorIndex = (
  decorators: MessageDecorator[],
  type: MessageDecorator['type'],
): number => decorators.findIndex((decoration) => decoration.type === type);

import { useEffect, useLayoutEffect, useRef } from 'react';

import type { MessageDecorator } from '@/store/diary/type';

import type { ComposerContext, RuntimeContribution } from './charm.types';

type UseDecoratorRuntimeOptions = {
  ctx: ComposerContext;
  runtimes: RuntimeContribution[];
  enabled?: boolean;
};

export const useDecoratorRuntime = ({
  ctx,
  runtimes,
  enabled = true,
}: UseDecoratorRuntimeOptions): void => {
  const ctxRef = useRef(ctx);

  useLayoutEffect(() => {
    ctxRef.current = ctx;
  });

  useEffect(() => {
    if (!enabled || runtimes.length === 0) {
      return;
    }

    const tick = () => {
      const currentCtx = ctxRef.current;

      for (const runtime of runtimes) {
        currentCtx.decorators.forEach((decoration, decoratorIndex) => {
          if (decoration.type !== runtime.decoratorType) {
            return;
          }

          if (!runtime.shouldTick(currentCtx, decoration)) {
            return;
          }

          const next = runtime.tick(decoration, Date.now());
          if (next !== decoration) {
            currentCtx.updateDecorator(decoratorIndex, next);
          }
        });
      }
    };

    const hasActiveTick = () =>
      runtimes.some((runtime) =>
        ctxRef.current.decorators.some(
          (decoration) =>
            decoration.type === runtime.decoratorType &&
            runtime.shouldTick(ctxRef.current, decoration),
        ),
      );

    if (!hasActiveTick()) {
      return;
    }

    tick();
    const timer = window.setInterval(() => {
      if (hasActiveTick()) {
        tick();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [ctx.decorators, enabled, runtimes]);
};

export const findDecoratorIndex = (
  decorators: MessageDecorator[],
  type: MessageDecorator['type'],
): number => decorators.findIndex((decoration) => decoration.type === type);

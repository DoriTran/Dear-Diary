import type { FC, ReactNode } from 'react';

import type { MessageDecorator } from '@/store/diary/type';

import type { ComposerDraft } from '../../Composer/composer.types';

import { useComposerContext } from '../charms/buildComposerContext';
import { useCharmPipeline } from '../charms/useCharmPipeline';
import { useDecoratorRuntime } from '../charms/useDecoratorRuntime';
import ComposerSurface from '../ComposerSurface/ComposerSurface';

export type DecoratedSurfaceProps = {
  draft: ComposerDraft;
  composing: boolean;
  borderless?: boolean;
  children: ReactNode;
  updateDecorator: (index: number, decoration: MessageDecorator) => void;
  updateDraft: (updater: (draft: ComposerDraft) => ComposerDraft) => void;
};

const DecoratedSurface: FC<DecoratedSurfaceProps> = ({
  draft,
  composing,
  borderless = false,
  children,
  updateDecorator,
  updateDraft,
}) => {
  const ctx = useComposerContext({
    draft,
    composing,
    updateDecorator,
    updateDraft,
  });

  const pipeline = useCharmPipeline(draft.decorators, ctx);
  const hasTimer = draft.decorators.some((d) => d.type === 'timer');

  useDecoratorRuntime({
    ctx,
    runtimes: pipeline.runtimes,
  });

  return (
    <ComposerSurface
      pipeline={pipeline}
      ctx={ctx}
      borderless={borderless}
      hasTimer={hasTimer}
    >
      {children}
    </ComposerSurface>
  );
};

export default DecoratedSurface;

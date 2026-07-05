import { useMemo } from 'react';

import type { MessageDecorator } from '@/store/diary/type';

import type { ComposerContext, MergedPipeline } from './charm.types';

import { collectCharms } from './collectCharms';
import { mergeContributions } from './mergeContributions';

export const useCharmPipeline = (
  decorators: MessageDecorator[],
  ctx: ComposerContext,
): MergedPipeline => {
  return useMemo(() => {
    const charms = collectCharms(decorators, ctx);
    return mergeContributions(charms);
  }, [ctx, decorators]);
};

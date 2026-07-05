import { useCallback, useMemo } from 'react';

import type { MessageDecorator } from '@/store/diary/type';

import type { ComposerDraft } from '../../input/composer.types';
import type {
  ComposerRelationship,
  ComposerContext,
  ComposerEvent,
} from './charm.types';

import { handleDecoratorEvent } from '../decoratorRegistry';

type BuildComposerContextOptions = {
  draft: ComposerDraft;
  composing: boolean;
  updateDecorator: (index: number, decoration: MessageDecorator) => void;
  updateDraft: (updater: (draft: ComposerDraft) => ComposerDraft) => void;
};

export const buildComposerContext = ({
  draft,
  composing,
  updateDecorator,
  updateDraft,
}: BuildComposerContextOptions): ComposerContext => {
  const relationships: ComposerRelationship[] = [];

  if (draft.replyToMessageId) {
    relationships.push({
      type: 'reply' as const,
      messageId: draft.replyToMessageId,
    });
  }

  return {
    draft,
    variant: draft.variant,
    decorators: draft.decorators,
    attachments: draft.attachments,
    relationships,
    composing,
    updateDecorator,
    updateDraft,
    emit: (event: ComposerEvent) => {
      handleDecoratorEvent(event, {
        draft,
        variant: draft.variant,
        decorators: draft.decorators,
        attachments: draft.attachments,
        relationships,
        composing,
        updateDecorator,
        updateDraft,
        emit: () => undefined,
      });
    },
  };
};

export const useComposerContext = (
  options: BuildComposerContextOptions,
): ComposerContext => {
  const { draft, composing, updateDecorator, updateDraft } = options;

  const emit = useCallback(
    (event: ComposerEvent) => {
      const relationships = draft.replyToMessageId
        ? [{ type: 'reply' as const, messageId: draft.replyToMessageId }]
        : [];

      handleDecoratorEvent(event, {
        draft,
        variant: draft.variant,
        decorators: draft.decorators,
        attachments: draft.attachments,
        relationships,
        composing,
        updateDecorator,
        updateDraft,
        emit: () => undefined,
      });
    },
    [composing, draft, updateDecorator, updateDraft],
  );

  return useMemo(
    (): ComposerContext => ({
      draft,
      variant: draft.variant,
      decorators: draft.decorators,
      attachments: draft.attachments,
      relationships: draft.replyToMessageId
        ? [{ type: 'reply', messageId: draft.replyToMessageId }]
        : [],
      composing,
      updateDecorator,
      updateDraft,
      emit,
    }),
    [composing, draft, emit, updateDecorator, updateDraft],
  );
};

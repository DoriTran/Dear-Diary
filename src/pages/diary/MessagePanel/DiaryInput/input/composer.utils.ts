import type {
  Attachment,
  Message,
  MessageDecorator,
  MessageVariant,
  TodoItem,
} from '@/store/diary/type';

import { createDefaultTimerDecorator } from '../decorator/timer/timer.utils';
import { createEmptyTodoItem, type ComposerDraft } from './composer.types';

export const createTicketDecorator = (): MessageDecorator => ({
  type: 'ticket',
  state: 'todo',
  ticked: false,
});

export const createTimerDecorator = (): MessageDecorator =>
  createDefaultTimerDecorator();

export const hasDraftContent = (draft: ComposerDraft): boolean => {
  if (draft.attachments.length > 0 || draft.decorators.length > 0) {
    return true;
  }

  if (draft.variant === 'todo') {
    return draft.todoItems.some(
      (item) => item.text.trim() || item.attachments.length > 0,
    );
  }

  return draft.text.trim().length > 0;
};

export const draftHasVariantContent = (draft: ComposerDraft): boolean => {
  if (draft.variant === 'todo') {
    return draft.todoItems.some((item) => item.text.trim());
  }

  return draft.text.trim().length > 0;
};

export const convertDraftToVariant = (
  draft: ComposerDraft,
  nextVariant: MessageVariant,
): Pick<ComposerDraft, 'variant' | 'text' | 'todoItems'> => {
  if (draft.variant === nextVariant) {
    return {
      variant: draft.variant,
      text: draft.text,
      todoItems: draft.todoItems,
    };
  }

  if (nextVariant === 'todo') {
    const lines = draft.text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const items =
      lines.length > 0
        ? lines.map((line) => ({
            ...createEmptyTodoItem(),
            text: line,
          }))
        : [createEmptyTodoItem()];

    return { variant: 'todo', text: '', todoItems: items };
  }

  if (draft.variant === 'todo') {
    const text = draft.todoItems
      .map((item) => item.text.trim())
      .filter(Boolean)
      .join('\n');

    return { variant: nextVariant, text, todoItems: [createEmptyTodoItem()] };
  }

  return {
    variant: nextVariant,
    text: draft.text,
    todoItems: [createEmptyTodoItem()],
  };
};

export const buildMessagePayload = (
  draft: ComposerDraft,
  chatboxId: string,
): Partial<Message> | null => {
  if (!hasDraftContent(draft)) {
    return null;
  }

  const base = {
    chatboxId,
    sender: 'user' as const,
    attachments: draft.attachments,
    decorators: draft.decorators,
    tagIds: [],
    pinned: false,
    archived: false,
    replyToMessageId: draft.replyToMessageId,
    sourceMessageId: null,
    reactions: [],
  };

  if (draft.variant === 'todo') {
    const items = draft.todoItems
      .filter((item) => item.text.trim() || item.attachments.length > 0)
      .map(
        (item): TodoItem => ({
          id: item.id,
          completed: item.completed,
          content: { text: item.text.trim() },
          attachments: item.attachments,
        }),
      );

    if (items.length === 0) {
      return null;
    }

    return {
      ...base,
      variant: 'todo',
      content: { items },
    };
  }

  if (draft.variant === 'ai') {
    return {
      ...base,
      variant: 'ai',
      content: { text: draft.text.trim() },
    };
  }

  return {
    ...base,
    variant: 'text',
    content: { text: draft.text.trim() },
  };
};

export const fileToAttachmentType = (
  file: File,
  kind: 'file' | 'image' | 'video',
): Attachment['type'] => {
  if (kind === 'image') {
    return 'image';
  }

  if (kind === 'video') {
    return 'video';
  }

  if (file.type.startsWith('image/')) {
    return 'image';
  }

  if (file.type.startsWith('video/')) {
    return 'video';
  }

  return 'file';
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) {
    return '';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

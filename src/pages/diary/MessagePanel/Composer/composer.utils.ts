import type {
  Attachment,
  Message,
  MessageDecoration,
  MessageType,
  TodoItem,
} from '@/store/diary/type';

import { createEmptyTodoItem, type ComposerDraft } from './composer.types';

export const defaultCountdownTargetDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
};

export const createTicketDecoration = (): MessageDecoration => ({
  type: 'ticket',
  title: '',
  state: 'todo',
  ticked: false,
});

export const createCountdownDecoration = (): MessageDecoration => ({
  type: 'countdown',
  title: '',
  targetDate: defaultCountdownTargetDate(),
  pause: false,
});

export const hasDraftContent = (draft: ComposerDraft): boolean => {
  if (draft.attachments.length > 0 || draft.decorations.length > 0) {
    return true;
  }

  if (draft.type === 'todo') {
    return draft.todoItems.some(
      (item) => item.text.trim() || item.attachments.length > 0,
    );
  }

  return draft.text.trim().length > 0;
};

export const draftHasTypeContent = (draft: ComposerDraft): boolean => {
  if (draft.type === 'todo') {
    return draft.todoItems.some((item) => item.text.trim());
  }

  return draft.text.trim().length > 0;
};

export const convertDraftToType = (
  draft: ComposerDraft,
  nextType: MessageType,
): Pick<ComposerDraft, 'type' | 'text' | 'todoItems'> => {
  if (draft.type === nextType) {
    return {
      type: draft.type,
      text: draft.text,
      todoItems: draft.todoItems,
    };
  }

  if (nextType === 'todo') {
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

    return { type: 'todo', text: '', todoItems: items };
  }

  if (draft.type === 'todo') {
    const text = draft.todoItems
      .map((item) => item.text.trim())
      .filter(Boolean)
      .join('\n');

    return { type: nextType, text, todoItems: [createEmptyTodoItem()] };
  }

  return {
    type: nextType,
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
    decorations: draft.decorations,
    tagIds: [],
    pinned: false,
    archived: false,
    replyToMessageId: draft.replyToMessageId,
    sourceMessageId: null,
    reactions: [],
  };

  if (draft.type === 'todo') {
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
      type: 'todo',
      content: { items },
    };
  }

  if (draft.type === 'ai') {
    return {
      ...base,
      type: 'ai',
      content: { text: draft.text.trim() },
    };
  }

  return {
    ...base,
    type: 'text',
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

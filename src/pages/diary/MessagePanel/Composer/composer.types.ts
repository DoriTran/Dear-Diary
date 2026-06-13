import { v4 as uuidv4 } from 'uuid';

import type {
  Attachment,
  MessageDecoration,
  MessageType,
} from '@/store/diary/type';

export type DraftTodoItem = {
  id: string;
  completed: boolean;
  text: string;
  attachments: Attachment[];
};

export type ComposerDraft = {
  type: MessageType;
  decorations: MessageDecoration[];
  attachments: Attachment[];
  text: string;
  todoItems: DraftTodoItem[];
  focused: boolean;
  replyToMessageId: string | null;
};

export type ComposerEditorRef = {
  insertAtCursor: (value: string) => void;
  focus: () => void;
};

export const createEmptyTodoItem = (): DraftTodoItem => ({
  id: `todo:${uuidv4()}`,
  completed: false,
  text: '',
  attachments: [],
});

export const createInitialDraft = (): ComposerDraft => ({
  type: 'text',
  decorations: [],
  attachments: [],
  text: '',
  todoItems: [createEmptyTodoItem()],
  focused: false,
  replyToMessageId: null,
});

export type PendingTypeSwitch = {
  nextType: MessageType;
} | null;

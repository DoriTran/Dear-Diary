import { uuid } from 'uuidv4';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { DiaryStore, Group, Chatbox, Message } from './type';

import { idbStorage, getNewOrder, nowIso } from '../helper';

type Actions = {
  // CRUD
  createGroup: (data: Partial<Group>) => void;
  updateGroup: (id: string, data: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  createChatbox: (data: Partial<Chatbox>) => void;
  updateChatbox: (id: string, data: Partial<Chatbox>) => void;
  deleteChatbox: (id: string) => void;

  createMessage: (data: Partial<Message>) => void;
  updateMessage: (id: string, data: Partial<Message>) => void;
  deleteMessage: (id: string) => void;

  // QUERY
  getGroups: () => Group[];
  getChatboxesByGroup: (groupId: string) => Chatbox[];
  getMessagesByChatbox: (chatboxId: string) => Message[];

  // MOVE
  moveGroup: (
    id: string,
    targetId?: string,
    position?: 'before' | 'after',
  ) => void;

  moveChatbox: (
    chatboxId: string,
    targetChatboxId?: string,
    position?: 'before' | 'after',
  ) => void;

  moveMessage: (
    messageId: string,
    targetMessageId?: string,
    position?: 'before' | 'after',
  ) => void;
};

export const useDiaryStore = create<DiaryStore & Actions>()(
  persist(
    (set, get) => ({
      groups: {},
      chatboxes: {},
      messages: {},

      // ===== GROUP =====
      createGroup: (data) => {
        const { groups } = get();
        const list = Object.values(groups).sort((a, b) => a.order - b.order);
        const prev = list[list.length - 1]?.order;
        const order = getNewOrder(prev, undefined);
        const id = uuid();
        const g: Group = {
          id,
          title: data.title ?? '',
          description: data.description ?? '',
          color: data.color ?? '',
          order,
          createdAt: nowIso(),
          updatedAt: '',
        };
        set((s) => ({
          groups: { ...s.groups, [id]: g },
        }));
      },

      updateGroup: (id, data) =>
        set((s) => ({
          groups: {
            ...s.groups,
            [id]: { ...s.groups[id], ...data, updatedAt: nowIso() },
          },
        })),

      deleteGroup: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.groups;
          return { groups: rest };
        }),

      // ===== CHATBOX =====
      createChatbox: (data) => {
        const { chatboxes } = get();
        const groupId = data.groupId ?? '';
        const list = Object.values(chatboxes)
          .filter((c) => c.groupId === groupId)
          .sort((a, b) => a.order - b.order);
        const prev = list[list.length - 1]?.order;
        const order = getNewOrder(prev, undefined);
        const id = uuid();
        const c: Chatbox = {
          id,
          groupId,
          title: data.title ?? '',
          description: data.description ?? '',
          icon: data.icon ?? '',
          color: data.color ?? '',
          order,
          createdAt: nowIso(),
          updatedAt: '',
        };
        set((s) => ({
          chatboxes: { ...s.chatboxes, [id]: c },
        }));
      },

      updateChatbox: (id, data) =>
        set((s) => ({
          chatboxes: {
            ...s.chatboxes,
            [id]: { ...s.chatboxes[id], ...data, updatedAt: nowIso() },
          },
        })),

      deleteChatbox: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.chatboxes;
          return { chatboxes: rest };
        }),

      // ===== MESSAGE =====
      createMessage: (data) => {
        const { messages } = get();
        const chatboxId = data.chatboxId ?? '';
        const list = Object.values(messages)
          .filter((m) => m.chatboxId === chatboxId)
          .sort((a, b) => a.order - b.order);
        const prev = list[list.length - 1]?.order;
        const order = getNewOrder(prev, undefined);
        const id = uuid();
        const m: Message = {
          id,
          chatboxId,
          order,
          content: data.content ?? [],
          tagIds: data.tagIds ?? [],
          createdAt: nowIso(),
          updatedAt: '',
        };
        set((s) => ({
          messages: { ...s.messages, [id]: m },
        }));
      },

      updateMessage: (id, data) =>
        set((s) => ({
          messages: {
            ...s.messages,
            [id]: { ...s.messages[id], ...data, updatedAt: nowIso() },
          },
        })),

      deleteMessage: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.messages;
          return { messages: rest };
        }),

      // ===== QUERY =====
      getGroups: () => {
        const { groups } = get();
        return Object.values(groups).sort((a, b) => a.order - b.order);
      },

      getChatboxesByGroup: (groupId) => {
        const { chatboxes } = get();
        return Object.values(chatboxes)
          .filter((c) => c.groupId === groupId)
          .sort((a, b) => a.order - b.order);
      },

      getMessagesByChatbox: (chatboxId) => {
        const { messages } = get();
        return Object.values(messages)
          .filter((m) => m.chatboxId === chatboxId)
          .sort((a, b) => a.order - b.order);
      },

      // ===== MOVE GROUP =====
      moveGroup: (id, targetId, position = 'after') => {
        const { groups } = get();
        const item = groups[id];
        if (!item || id === targetId) return;

        const list = Object.values(groups)
          .filter((g) => g.id !== id)
          .sort((a, b) => a.order - b.order);

        let prev: number | undefined;
        let next: number | undefined;

        if (!targetId) {
          // move to end
          prev = list[list.length - 1]?.order;
          next = undefined;
        } else {
          const index = list.findIndex((g) => g.id === targetId);
          if (index === -1) return;

          if (position === 'before') {
            prev = list[index - 1]?.order;
            next = list[index]?.order;
          } else {
            prev = list[index]?.order;
            next = list[index + 1]?.order;
          }
        }

        const newOrder = getNewOrder(prev, next);

        set((s) => ({
          groups: {
            ...s.groups,
            [id]: { ...item, order: newOrder },
          },
        }));
      },

      // ===== MOVE CHATBOX =====
      moveChatbox: (id, targetId, position = 'after') => {
        const { chatboxes } = get();
        const item = chatboxes[id];
        if (!item) return;

        const list = Object.values(chatboxes)
          .filter((c) => c.groupId === item.groupId && c.id !== id)
          .sort((a, b) => a.order - b.order);

        let prev: number | undefined;
        let next: number | undefined;

        if (!targetId) {
          // move to end
          prev = list[list.length - 1]?.order;
          next = undefined;
        } else {
          const index = list.findIndex((c) => c.id === targetId);
          if (index === -1) return;

          if (position === 'before') {
            prev = list[index - 1]?.order;
            next = list[index]?.order;
          } else {
            prev = list[index]?.order;
            next = list[index + 1]?.order;
          }
        }

        const newOrder = getNewOrder(prev, next);

        set((s) => ({
          chatboxes: {
            ...s.chatboxes,
            [id]: { ...item, order: newOrder },
          },
        }));
      },

      // ===== MOVE MESSAGE =====
      moveMessage: (id, targetId, position = 'after') => {
        const { messages } = get();
        const item = messages[id];
        if (!item) return;

        const target = targetId ? messages[targetId] : null;

        const prev = position === 'after' ? target?.order : undefined;

        const next = position === 'before' ? target?.order : undefined;

        const newOrder = getNewOrder(prev, next);

        set((s) => ({
          messages: {
            ...s.messages,
            [id]: { ...item, order: newOrder },
          },
        }));
      },
    }),
    {
      name: 'dear-diary',
      storage: idbStorage,
    },
  ),
);

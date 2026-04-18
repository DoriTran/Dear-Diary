import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  DiaryStore,
  DiaryRootItem,
  Group,
  Chatbox,
  Message,
} from './type';

import { idbStorage, nowIso } from '../helper';
import { diaryDummyState } from './constants';

type Actions = {
  // CRUD
  createGroup: (data: Partial<Group>) => string;
  updateGroup: (id: string, data: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  createChatbox: (data: Partial<Chatbox>) => string;
  updateChatbox: (id: string, data: Partial<Chatbox>) => void;
  deleteChatbox: (id: string) => void;

  createMessage: (data: Partial<Message>) => string;
  updateMessage: (id: string, data: Partial<Message>) => void;
  deleteMessage: (id: string) => void;

  // ORDER
  updateRootOrder: (ids: string[]) => void;
  updateGroupChatOrder: (groupId: string, chatboxIds: string[]) => void;
  updateChatboxMessageOrder: (chatboxId: string, messageIds: string[]) => void;

  // QUERY
  getGroups: () => Group[];
  getChatboxesByGroup: (groupId: string) => Chatbox[];
  getMessagesByChatbox: (chatboxId: string) => Message[];
  getRootItems: () => DiaryRootItem[];
};

const ensureUnique = <T>(items: T[]) => Array.from(new Set(items));

export const useDiaryStore = create<DiaryStore & Actions>()(
  persist(
    (set, get) => ({
      ...diaryDummyState,

      // ===== GROUP =====
      createGroup: (data) => {
        const id = data.id ?? `gr:${uuidv4()}`;
        const createdAt = nowIso();

        const group: Group = {
          id,
          title: data.title ?? '',
          description: data.description ?? '',
          color: data.color ?? '',
          createdAt,
          updatedAt: '',
        };

        set((state) => ({
          groups: {
            ...state.groups,
            [id]: group,
          },
          orders: {
            ...state.orders,
            rootOrders: [...state.orders.rootOrders, id],
            groupChatboxOrders: {
              ...state.orders.groupChatboxOrders,
              [id]: state.orders.groupChatboxOrders[id] ?? [],
            },
          },
        }));

        return id;
      },

      updateGroup: (id, data) =>
        set((state) => {
          const current = state.groups[id];
          if (!current) return state;

          return {
            groups: {
              ...state.groups,
              [id]: {
                ...current,
                ...data,
                id,
                updatedAt: nowIso(),
              },
            },
          };
        }),

      deleteGroup: (id) =>
        set((state) => {
          const current = state.groups[id];
          if (!current) return state;

          const { [id]: _removedGroup, ...restGroups } = state.groups;
          const { [id]: groupChildren = [], ...restGroupOrders } =
            state.orders.groupChatboxOrders;

          const updatedChatboxes = { ...state.chatboxes };

          for (const chatboxId of groupChildren) {
            const chatbox = updatedChatboxes[chatboxId];
            if (chatbox) {
              updatedChatboxes[chatboxId] = {
                ...chatbox,
                groupId: '',
                updatedAt: nowIso(),
              };
            }
          }

          return {
            groups: restGroups,
            chatboxes: updatedChatboxes,
            orders: {
              ...state.orders,
              rootOrders: state.orders.rootOrders
                .filter((itemId) => itemId !== id)
                .concat(
                  groupChildren.filter(
                    (chatboxId) => !!updatedChatboxes[chatboxId],
                  ),
                ),
              groupChatboxOrders: restGroupOrders,
            },
          };
        }),

      // ===== CHATBOX =====
      createChatbox: (data) => {
        const id = data.id ?? `cb:${uuidv4()}`;
        const groupId = data.groupId ?? '';
        const createdAt = nowIso();

        const chatbox: Chatbox = {
          id,
          groupId,
          title: data.title ?? '',
          description: data.description ?? '',
          icon: data.icon ?? '',
          color: data.color ?? '',
          createdAt,
          updatedAt: '',
        };

        set((state) => {
          const nextOrders = {
            ...state.orders,
            rootOrders: [...state.orders.rootOrders],
            groupChatboxOrders: { ...state.orders.groupChatboxOrders },
            chatboxMessageOrders: { ...state.orders.chatboxMessageOrders },
          };

          if (groupId) {
            nextOrders.groupChatboxOrders[groupId] = [
              ...(nextOrders.groupChatboxOrders[groupId] ?? []),
              id,
            ];
          } else {
            nextOrders.rootOrders.push(id);
          }

          nextOrders.chatboxMessageOrders[id] =
            nextOrders.chatboxMessageOrders[id] ?? [];

          return {
            chatboxes: {
              ...state.chatboxes,
              [id]: chatbox,
            },
            orders: nextOrders,
          };
        });

        return id;
      },

      updateChatbox: (id, data) =>
        set((state) => {
          const current = state.chatboxes[id];
          if (!current) return state;

          const nextGroupId =
            data.groupId !== undefined ? data.groupId : current.groupId;

          if (nextGroupId === current.groupId) {
            return {
              chatboxes: {
                ...state.chatboxes,
                [id]: {
                  ...current,
                  ...data,
                  id,
                  updatedAt: nowIso(),
                },
              },
            };
          }

          const nextOrders = {
            ...state.orders,
            rootOrders: [...state.orders.rootOrders],
            groupChatboxOrders: { ...state.orders.groupChatboxOrders },
          };

          if (current.groupId) {
            nextOrders.groupChatboxOrders[current.groupId] = (
              nextOrders.groupChatboxOrders[current.groupId] ?? []
            ).filter((chatboxId) => chatboxId !== id);
          } else {
            nextOrders.rootOrders = nextOrders.rootOrders.filter(
              (itemId) => itemId !== id,
            );
          }

          if (nextGroupId) {
            nextOrders.groupChatboxOrders[nextGroupId] = [
              ...(nextOrders.groupChatboxOrders[nextGroupId] ?? []),
              id,
            ];
          } else {
            nextOrders.rootOrders.push(id);
          }

          return {
            chatboxes: {
              ...state.chatboxes,
              [id]: {
                ...current,
                ...data,
                id,
                groupId: nextGroupId,
                updatedAt: nowIso(),
              },
            },
            orders: nextOrders,
          };
        }),

      deleteChatbox: (id) =>
        set((state) => {
          const current = state.chatboxes[id];
          if (!current) return state;

          const { [id]: _removedChatbox, ...restChatboxes } = state.chatboxes;
          const { [id]: messageOrder = [], ...restChatboxMessageOrders } =
            state.orders.chatboxMessageOrders;

          const nextMessages = { ...state.messages };
          for (const messageId of messageOrder) {
            delete nextMessages[messageId];
          }

          const nextOrders = {
            ...state.orders,
            rootOrders: state.orders.rootOrders.filter(
              (itemId) => itemId !== id,
            ),
            groupChatboxOrders: { ...state.orders.groupChatboxOrders },
            chatboxMessageOrders: restChatboxMessageOrders,
          };

          if (current.groupId) {
            nextOrders.groupChatboxOrders[current.groupId] = (
              nextOrders.groupChatboxOrders[current.groupId] ?? []
            ).filter((chatboxId) => chatboxId !== id);
          }

          return {
            chatboxes: restChatboxes,
            messages: nextMessages,
            orders: nextOrders,
          };
        }),

      // ===== MESSAGE =====
      createMessage: (data) => {
        const id = data.id ?? `ms:${uuidv4()}`;
        const chatboxId = data.chatboxId ?? '';
        const createdAt = nowIso();

        const message: Message = {
          id,
          chatboxId,
          content: data.content ?? [],
          tagIds: data.tagIds ?? [],
          createdAt,
          updatedAt: '',
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [id]: message,
          },
          orders: {
            ...state.orders,
            chatboxMessageOrders: {
              ...state.orders.chatboxMessageOrders,
              [chatboxId]: [
                ...(state.orders.chatboxMessageOrders[chatboxId] ?? []),
                id,
              ],
            },
          },
        }));

        return id;
      },

      updateMessage: (id, data) =>
        set((state) => {
          const current = state.messages[id];
          if (!current) return state;

          const nextChatboxId =
            data.chatboxId !== undefined ? data.chatboxId : current.chatboxId;

          if (nextChatboxId === current.chatboxId) {
            return {
              messages: {
                ...state.messages,
                [id]: {
                  ...current,
                  ...data,
                  id,
                  updatedAt: nowIso(),
                },
              },
            };
          }

          const nextOrders = {
            ...state.orders,
            chatboxMessageOrders: { ...state.orders.chatboxMessageOrders },
          };

          nextOrders.chatboxMessageOrders[current.chatboxId] = (
            nextOrders.chatboxMessageOrders[current.chatboxId] ?? []
          ).filter((messageId) => messageId !== id);

          nextOrders.chatboxMessageOrders[nextChatboxId] = [
            ...(nextOrders.chatboxMessageOrders[nextChatboxId] ?? []),
            id,
          ];

          return {
            messages: {
              ...state.messages,
              [id]: {
                ...current,
                ...data,
                id,
                chatboxId: nextChatboxId,
                updatedAt: nowIso(),
              },
            },
            orders: nextOrders,
          };
        }),

      deleteMessage: (id) =>
        set((state) => {
          const current = state.messages[id];
          if (!current) return state;

          const { [id]: _removedMessage, ...restMessages } = state.messages;

          return {
            messages: restMessages,
            orders: {
              ...state.orders,
              chatboxMessageOrders: {
                ...state.orders.chatboxMessageOrders,
                [current.chatboxId]: (
                  state.orders.chatboxMessageOrders[current.chatboxId] ?? []
                ).filter((messageId) => messageId !== id),
              },
            },
          };
        }),

      // ===== ORDER =====
      updateRootOrder: (ids) =>
        set((state) => ({
          orders: {
            ...state.orders,
            rootOrders: ensureUnique(ids).filter(
              (id) =>
                !!state.groups[id] ||
                (!!state.chatboxes[id] && !state.chatboxes[id].groupId),
            ),
          },
        })),

      updateGroupChatOrder: (groupId, chatboxIds) =>
        set((state) => {
          if (!state.groups[groupId]) return state;

          return {
            orders: {
              ...state.orders,
              groupChatboxOrders: {
                ...state.orders.groupChatboxOrders,
                [groupId]: ensureUnique(chatboxIds).filter(
                  (id) =>
                    !!state.chatboxes[id] &&
                    state.chatboxes[id].groupId === groupId,
                ),
              },
            },
          };
        }),

      updateChatboxMessageOrder: (chatboxId, messageIds) =>
        set((state) => {
          if (!state.chatboxes[chatboxId]) return state;

          return {
            orders: {
              ...state.orders,
              chatboxMessageOrders: {
                ...state.orders.chatboxMessageOrders,
                [chatboxId]: ensureUnique(messageIds).filter(
                  (id) =>
                    !!state.messages[id] &&
                    state.messages[id].chatboxId === chatboxId,
                ),
              },
            },
          };
        }),

      // ===== QUERY =====
      getGroups: () => {
        const { groups, orders } = get();
        return orders.rootOrders
          .filter((id) => id.startsWith('gr:'))
          .map((id) => groups[id])
          .filter(Boolean);
      },

      getChatboxesByGroup: (groupId) => {
        const { chatboxes, orders } = get();

        if (!groupId) {
          return orders.rootOrders
            .filter((id) => id.startsWith('cb:'))
            .map((id) => chatboxes[id])
            .filter(
              (chatbox): chatbox is Chatbox => !!chatbox && !chatbox.groupId,
            );
        }

        return (orders.groupChatboxOrders[groupId] ?? [])
          .map((id) => chatboxes[id])
          .filter(Boolean);
      },

      getMessagesByChatbox: (chatboxId) => {
        const { messages, orders } = get();
        return (orders.chatboxMessageOrders[chatboxId] ?? [])
          .map((id) => messages[id])
          .filter(Boolean);
      },

      getRootItems: () => {
        const { groups, chatboxes, orders } = get();

        return orders.rootOrders
          .map((id): DiaryRootItem | null => {
            if (id.startsWith('gr:')) {
              const group = groups[id];
              if (!group) return null;

              const childChatboxes = (orders.groupChatboxOrders[id] ?? [])
                .map((chatboxId) => chatboxes[chatboxId])
                .filter(Boolean);

              return {
                type: 'group',
                data: group,
                chatboxes: childChatboxes,
              };
            }

            if (id.startsWith('cb:')) {
              const chatbox = chatboxes[id];
              if (!chatbox || chatbox.groupId) return null;

              return {
                type: 'chatbox',
                data: chatbox,
              };
            }

            return null;
          })
          .filter(Boolean) as DiaryRootItem[];
      },
    }),
    {
      name: 'dear-diary',
      storage: idbStorage,
      partialize: (state) => ({
        groups: state.groups,
        chatboxes: state.chatboxes,
        messages: state.messages,
        orders: state.orders,
      }),
    },
  ),
);

import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  DiaryStore,
  DiaryStoreActions,
  Group,
  Chatbox,
  ChatboxUpdateData,
  Message,
  MessageUpdateData,
  Tag,
} from './type';

import { idbStorage, nowIso } from '../helper';
import shallow from '../shallow';
import { diaryDummyState, diaryInitialState } from './constants';

// #region Helpers

const ensureUnique = <T>(items: T[]) => {
  return Array.from(new Set(items));
};

const recalculateChatboxMetadata = (
  state: DiaryStore,
  chatboxId: string,
): DiaryStore => {
  const chatbox = state.chatboxes[chatboxId];

  if (!chatbox) {
    return state;
  }

  const messageIds = state.orders.chatboxMessageOrders[chatboxId] ?? [];

  const totalMessage = messageIds.length;

  const lastMessageId = messageIds.at(-1) ?? null;

  const lastMessageAt = lastMessageId
    ? (state.messages[lastMessageId]?.createdAt ?? null)
    : null;

  return {
    ...state,
    chatboxes: {
      ...state.chatboxes,
      [chatboxId]: {
        ...chatbox,
        totalMessage,
        lastMessageId,
        lastMessageAt,
      },
    },
  };
};

const recalculateChatboxTags = (
  state: DiaryStore,
  chatboxId: string,
): DiaryStore => {
  const chatbox = state.chatboxes[chatboxId];

  if (!chatbox) {
    return state;
  }

  const counts = new Map<string, number>();

  const messageIds = state.orders.chatboxMessageOrders[chatboxId] ?? [];

  messageIds.forEach((messageId) => {
    const message = state.messages[messageId];

    if (!message) {
      return;
    }

    message.tagIds.forEach((tagId) => {
      counts.set(tagId, (counts.get(tagId) ?? 0) + 1);
    });
  });

  const tags = Array.from(counts.entries()).map(([tagId, count]) => ({
    tagId,
    count,
  }));

  return {
    ...state,
    chatboxes: {
      ...state.chatboxes,
      [chatboxId]: {
        ...chatbox,
        tags,
      },
    },
  };
};

// #endregion

const useDiaryStoreBase = create<DiaryStore & DiaryStoreActions>()(
  persist(
    (set, get) => ({
      ...diaryInitialState,

      // #region Group
      createGroup: (data: Partial<Group> = {}) => {
        const id = data.id ?? `gr:${uuidv4()}`;

        const now = nowIso();

        const group: Group = {
          id,
          name: data.name ?? '',
          icon: data.icon ?? '',
          color: data.color ?? '',
          createdAt: now,
          updatedAt: null,
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
              [id]: [],
            },
          },
        }));

        return id;
      },
      updateGroup: (groupId, data) =>
        set((state) => {
          const current = state.groups[groupId];

          if (!current) {
            return state;
          }

          return {
            groups: {
              ...state.groups,
              [groupId]: {
                ...current,
                ...data,
                id: groupId,
                updatedAt: nowIso(),
              },
            },
          };
        }),
      deleteGroup: (groupId) =>
        set((state) => {
          const group = state.groups[groupId];

          if (!group) {
            return state;
          }

          const { [groupId]: _removedGroup, ...groups } = state.groups;

          const { [groupId]: childChatboxes = [], ...groupChatboxOrders } =
            state.orders.groupChatboxOrders;

          const chatboxes = {
            ...state.chatboxes,
          };

          childChatboxes.forEach((chatboxId) => {
            const chatbox = chatboxes[chatboxId];

            if (!chatbox) {
              return;
            }

            chatboxes[chatboxId] = {
              ...chatbox,
              groupId: null,
              updatedAt: nowIso(),
            };
          });

          return {
            groups,
            chatboxes,
            orders: {
              ...state.orders,
              rootOrders: state.orders.rootOrders
                .filter((id) => id !== groupId)
                .concat(childChatboxes),
              groupChatboxOrders,
            },
          };
        }),
      // #endregion

      // #region Chatbox
      createChatbox: (data: Partial<Chatbox> = {}) => {
        const id = data.id ?? `cb:${uuidv4()}`;

        const now = nowIso();

        const groupId = data.groupId ?? null;

        const chatbox: Chatbox = {
          id,
          groupId,
          name: data.name ?? '',
          description: data.description ?? '',
          icon: data.icon ?? '',
          color: data.color ?? '',
          pinned: false,
          archived: false,
          hasUnread: false,
          notificationEnabled: false,
          tags: [],
          totalMessage: 0,
          lastMessageId: null,
          lastMessageAt: null,
          createdAt: now,
          updatedAt: null,
        };

        set((state) => {
          const orders = {
            ...state.orders,
            rootOrders: [...state.orders.rootOrders],
            groupChatboxOrders: {
              ...state.orders.groupChatboxOrders,
            },
            chatboxMessageOrders: {
              ...state.orders.chatboxMessageOrders,
            },
          };

          if (groupId) {
            orders.groupChatboxOrders[groupId] = [
              ...(orders.groupChatboxOrders[groupId] ?? []),
              id,
            ];
          } else {
            orders.rootOrders.push(id);
          }

          orders.chatboxMessageOrders[id] = [];

          return {
            chatboxes: {
              ...state.chatboxes,
              [id]: chatbox,
            },
            orders,
          };
        });

        return id;
      },
      updateChatbox: (chatboxId, data: ChatboxUpdateData) =>
        set((state) => {
          const current = state.chatboxes[chatboxId];

          if (!current) {
            return state;
          }

          return {
            chatboxes: {
              ...state.chatboxes,
              [chatboxId]: {
                ...current,
                ...data,
                id: chatboxId,
                groupId: current.groupId,
                tags: current.tags,
                totalMessage: current.totalMessage,
                lastMessageId: current.lastMessageId,
                lastMessageAt: current.lastMessageAt,
                createdAt: current.createdAt,
                updatedAt: nowIso(),
              },
            },
          };
        }),
      moveChatboxToGroup: (chatboxId, targetGroupId) =>
        set((state) => {
          const chatbox = state.chatboxes[chatboxId];

          if (!chatbox) {
            return state;
          }

          const sourceGroupId = chatbox.groupId;

          if (sourceGroupId === targetGroupId) {
            return state;
          }

          const orders = {
            ...state.orders,
            rootOrders: [...state.orders.rootOrders],
            groupChatboxOrders: {
              ...state.orders.groupChatboxOrders,
            },
          };

          if (sourceGroupId) {
            orders.groupChatboxOrders[sourceGroupId] = (
              orders.groupChatboxOrders[sourceGroupId] ?? []
            ).filter((id) => id !== chatboxId);
          } else {
            orders.rootOrders = orders.rootOrders.filter(
              (id) => id !== chatboxId,
            );
          }

          if (targetGroupId) {
            orders.groupChatboxOrders[targetGroupId] = [
              ...(orders.groupChatboxOrders[targetGroupId] ?? []),
              chatboxId,
            ];
          } else {
            orders.rootOrders.push(chatboxId);
          }

          return {
            chatboxes: {
              ...state.chatboxes,
              [chatboxId]: {
                ...chatbox,
                groupId: targetGroupId,
                updatedAt: nowIso(),
              },
            },
            orders,
          };
        }),
      deleteChatbox: (chatboxId) =>
        set((state) => {
          const current = state.chatboxes[chatboxId];

          if (!current) {
            return state;
          }

          const { [chatboxId]: _removedChatbox, ...chatboxes } =
            state.chatboxes;

          const { [chatboxId]: messageIds = [], ...chatboxMessageOrders } =
            state.orders.chatboxMessageOrders;

          const messages = {
            ...state.messages,
          };

          messageIds.forEach((messageId) => {
            delete messages[messageId];
          });

          const orders = {
            ...state.orders,
            rootOrders: state.orders.rootOrders.filter(
              (id) => id !== chatboxId,
            ),
            groupChatboxOrders: {
              ...state.orders.groupChatboxOrders,
            },
            chatboxMessageOrders,
          };

          if (current.groupId) {
            orders.groupChatboxOrders[current.groupId] = (
              orders.groupChatboxOrders[current.groupId] ?? []
            ).filter((id) => id !== chatboxId);
          }

          return {
            chatboxes,
            messages,
            orders,
          };
        }),
      // #endregion

      // #region Message
      createMessage: (data) => {
        const id = data.id ?? `ms:${uuidv4()}`;

        const chatboxId = data.chatboxId;

        if (!chatboxId) {
          return '';
        }

        const message: Message = {
          ...(data as Message),
          id,
          edited: false,
          createdAt: nowIso(),
          updatedAt: null,
        };

        set((state) => {
          let nextState: DiaryStore = {
            ...state,
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
          };

          nextState = recalculateChatboxMetadata(nextState, chatboxId);

          nextState = recalculateChatboxTags(nextState, chatboxId);

          return nextState;
        });

        return id;
      },
      updateMessage: (messageId, data: MessageUpdateData) =>
        set((state) => {
          const current = state.messages[messageId];

          if (!current) {
            return state;
          }

          let nextState: DiaryStore = {
            ...state,
            messages: {
              ...state.messages,
              [messageId]: {
                ...current,
                ...data,
                id: messageId,
                chatboxId: current.chatboxId,
                edited: true,
                updatedAt: nowIso(),
              } as Message,
            },
          };

          nextState = recalculateChatboxTags(nextState, current.chatboxId);

          return nextState;
        }),
      deleteMessage: (messageId) =>
        set((state) => {
          const current = state.messages[messageId];

          if (!current) {
            return state;
          }

          const { [messageId]: _removedMessage, ...messages } = state.messages;

          let nextState: DiaryStore = {
            ...state,
            messages,
            orders: {
              ...state.orders,
              chatboxMessageOrders: {
                ...state.orders.chatboxMessageOrders,
                [current.chatboxId]: (
                  state.orders.chatboxMessageOrders[current.chatboxId] ?? []
                ).filter((id) => id !== messageId),
              },
            },
          };

          nextState = recalculateChatboxMetadata(nextState, current.chatboxId);

          nextState = recalculateChatboxTags(nextState, current.chatboxId);

          return nextState;
        }),
      moveMessage: (messageId, targetChatboxId) =>
        set((state) => {
          const message = state.messages[messageId];

          if (!message) {
            return state;
          }

          const sourceChatboxId = message.chatboxId;

          if (sourceChatboxId === targetChatboxId) {
            return state;
          }

          let nextState: DiaryStore = {
            ...state,
            messages: {
              ...state.messages,
              [messageId]: {
                ...message,
                chatboxId: targetChatboxId,
                updatedAt: nowIso(),
              },
            },
            orders: {
              ...state.orders,
              chatboxMessageOrders: {
                ...state.orders.chatboxMessageOrders,
                [sourceChatboxId]: (
                  state.orders.chatboxMessageOrders[sourceChatboxId] ?? []
                ).filter((id) => id !== messageId),
                [targetChatboxId]: [
                  ...(state.orders.chatboxMessageOrders[targetChatboxId] ?? []),
                  messageId,
                ],
              },
            },
          };

          nextState = recalculateChatboxMetadata(nextState, sourceChatboxId);

          nextState = recalculateChatboxMetadata(nextState, targetChatboxId);

          nextState = recalculateChatboxTags(nextState, sourceChatboxId);

          nextState = recalculateChatboxTags(nextState, targetChatboxId);

          return nextState;
        }),

      // #endregion

      // #region Tag
      createTag: (data: Partial<Tag> = {}) => {
        const id = data.id ?? `tag:${uuidv4()}`;

        const tag: Tag = {
          id,
          label: data.label ?? '',
          color: data.color ?? '',
        };

        set((state) => ({
          tags: {
            ...state.tags,
            [id]: tag,
          },
        }));

        return id;
      },
      updateTag: (tagId, data) =>
        set((state) => {
          const current = state.tags[tagId];

          if (!current) {
            return state;
          }

          return {
            tags: {
              ...state.tags,
              [tagId]: {
                ...current,
                ...data,
                id: tagId,
              },
            },
          };
        }),
      deleteTag: (tagId) =>
        set((state) => {
          if (!state.tags[tagId]) {
            return state;
          }

          const { [tagId]: _removedTag, ...tags } = state.tags;

          const affectedChatboxIds = new Set<string>();

          const messages = {
            ...state.messages,
          };

          Object.entries(messages).forEach(([messageId, message]) => {
            if (!message.tagIds.includes(tagId)) {
              return;
            }

            affectedChatboxIds.add(message.chatboxId);

            messages[messageId] = {
              ...message,
              tagIds: message.tagIds.filter((id) => id !== tagId),
              updatedAt: nowIso(),
            };
          });

          let nextState: DiaryStore = {
            ...state,
            tags,
            messages,
          };

          affectedChatboxIds.forEach((chatboxId) => {
            nextState = recalculateChatboxTags(nextState, chatboxId);
          });

          return nextState;
        }),

      // #endregion

      // #region Orders
      updateRootOrders: (ids) =>
        set((state) => ({
          orders: {
            ...state.orders,
            rootOrders: ensureUnique(ids),
          },
        })),
      updateGroupChatboxOrders: (groupId, ids) =>
        set((state) => ({
          orders: {
            ...state.orders,
            groupChatboxOrders: {
              ...state.orders.groupChatboxOrders,
              [groupId]: ensureUnique(ids),
            },
          },
        })),
      updateChatboxMessageOrders: (chatboxId, ids) =>
        set((state) => ({
          orders: {
            ...state.orders,
            chatboxMessageOrders: {
              ...state.orders.chatboxMessageOrders,
              [chatboxId]: ensureUnique(ids),
            },
          },
        })),
      // #endregion

      // #region Utility
      reset: () =>
        set(() => ({
          ...diaryInitialState,
        })),
      seedIfEmpty: () => {
        const state = get();

        if (Object.keys(state.groups).length > 0) {
          return;
        }

        set(() => ({
          ...diaryDummyState,
        }));
      },
      // #endregion
    }),
    {
      name: 'dear-diary',
      storage: idbStorage,
      partialize: (state) => ({
        groups: state.groups,
        chatboxes: state.chatboxes,
        messages: state.messages,
        tags: state.tags,
        orders: state.orders,
      }),
    },
  ),
);

export const useDiaryStore = shallow(useDiaryStoreBase);

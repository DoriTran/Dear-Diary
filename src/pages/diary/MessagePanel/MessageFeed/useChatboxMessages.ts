import { useMemo } from 'react';

import type { Message } from '@/store/diary/type';

import { useDiaryStore } from '@/store';

import { groupMessagesByDay, type MessageDayGroup } from './message.utils';
import { messageMatchesSearch } from './messagePreview.utils';

export type UseChatboxMessagesOptions = {
  searchQuery?: string;
  forceVisibleMessageIds?: string[];
};

export const useChatboxMessages = (
  chatboxId: string,
  options: UseChatboxMessagesOptions = {},
): { groups: MessageDayGroup[]; messages: Message[] } => {
  const { searchQuery = '', forceVisibleMessageIds = [] } = options;
  const { messages, orders } = useDiaryStore(['messages', 'orders']);

  return useMemo(() => {
    const ids = orders.chatboxMessageOrders[chatboxId] ?? [];
    const forcedIds = new Set(forceVisibleMessageIds);
    const chatMessages = ids
      .map((id) => messages[id])
      .filter((message): message is Message => Boolean(message))
      .filter(
        (message) => forcedIds.has(message.id) || !message.archived,
      )
      .filter((message) => messageMatchesSearch(message, searchQuery));

    return {
      messages: chatMessages,
      groups: groupMessagesByDay(chatMessages),
    };
  }, [
    chatboxId,
    forceVisibleMessageIds,
    messages,
    orders.chatboxMessageOrders,
    searchQuery,
  ]);
};

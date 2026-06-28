import { resolvePalette } from '@/packages/color';
import { normalizeIconId } from '@/packages/icon';
import { useAppStore, useDiaryStore } from '@/store';

import type { ChatboxData, GroupData } from '../types';

import { mapChatboxData } from './Chatbox/chatbox.utils';

export const useSidebarGroups = (): GroupData[] => {
  const mode = useAppStore('mode');
  const { groups, chatboxes, tags, messages, orders, customPalettes } =
    useDiaryStore([
      'groups',
      'chatboxes',
      'tags',
      'messages',
      'orders',
      'customPalettes',
    ]);

  const mapOptions = {
    mode,
    customPalettes,
  };

  return orders.rootOrders
    .map((rowId) => {
      const group = groups[rowId];

      if (!group) {
        return null;
      }

      const groupPalette = resolvePalette(group.colorId, mode, customPalettes);
      const chatboxIds = orders.groupChatboxOrders[rowId] ?? [];

      const mappedChatboxes = chatboxIds
        .map((chatboxId) => {
          const chatbox = chatboxes[chatboxId];

          if (!chatbox) {
            return null;
          }

          const lastMessage = chatbox.lastMessageId
            ? messages[chatbox.lastMessageId]
            : null;

          return mapChatboxData(chatbox, tags, lastMessage, mapOptions);
        })
        .filter((chatbox): chatbox is ChatboxData => chatbox !== null);

      return {
        id: group.id,
        title: group.name,
        brushColor: groupPalette.main,
        groupIcon: normalizeIconId(group.icon),
        chatboxes: mappedChatboxes,
      };
    })
    .filter((group): group is GroupData => group !== null);
};

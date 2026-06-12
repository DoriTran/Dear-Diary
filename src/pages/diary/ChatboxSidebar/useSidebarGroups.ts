import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import {
  faQuestion,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import { useDiaryStore } from '@/store';

import type { ChatboxData, GroupData } from '../types';

import {
  buildIconBackground,
  getMessagePreview,
} from './Chatbox/chatbox.utils';

const resolveFaIcon = (icon: string): IconDefinition => {
  return (
    (solidIcons as unknown as Record<string, IconDefinition>)[icon] ||
    faQuestion
  );
};

export const useSidebarGroups = (): GroupData[] => {
  const { groups, chatboxes, tags, messages, orders } = useDiaryStore([
    'groups',
    'chatboxes',
    'tags',
    'messages',
    'orders',
  ]);

  const { rootOrders, groupChatboxOrders } = orders;

  return rootOrders
    .map((groupId) => {
      const group = groups[groupId];

      if (!group) {
        return null;
      }

      const chatboxIds = groupChatboxOrders[groupId] ?? [];

      const mappedChatboxes: ChatboxData[] = chatboxIds
        .map((chatboxId) => {
          const chatbox = chatboxes[chatboxId];

          if (!chatbox) {
            return null;
          }

          const lastMessage = chatbox.lastMessageId
            ? messages[chatbox.lastMessageId]
            : null;

          const resolvedTags = chatbox.tags
            .map((stat) => {
              const tag = tags[stat.tagId];

              if (!tag) {
                return null;
              }

              return {
                label: tag.label,
                count: stat.count,
                color: tag.color,
              };
            })
            .filter((tag): tag is NonNullable<typeof tag> => tag !== null);

          return {
            id: chatbox.id,
            name: chatbox.name,
            description: chatbox.description,
            preview: getMessagePreview(lastMessage),
            tags: resolvedTags,
            icon: resolveFaIcon(chatbox.icon),
            color: chatbox.color,
            iconBg: buildIconBackground(chatbox.color),
            pinned: chatbox.pinned,
            archived: chatbox.archived,
            hasUnread: chatbox.hasUnread,
            notificationEnabled: chatbox.notificationEnabled,
            totalMessage: chatbox.totalMessage,
            lastMessageAt: chatbox.lastMessageAt,
          };
        })
        .filter((chatbox): chatbox is ChatboxData => chatbox !== null);

      return {
        id: group.id,
        title: group.name,
        brushColor: group.color,
        groupIcon: resolveFaIcon(group.icon),
        chatboxes: mappedChatboxes,
      };
    })
    .filter((group): group is GroupData => group !== null);
};

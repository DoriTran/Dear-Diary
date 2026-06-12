import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import {
  faQuestion,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';

import type { DiaryStore, Message } from '@/store/diary/type';

import { useDiaryStore } from '@/store';

import type { ChatboxData, GroupData } from '../types';
import type { SidebarRow } from './sidebar.types';

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

const mapChatbox = (
  chatboxId: string,
  chatboxes: DiaryStore['chatboxes'],
  tags: DiaryStore['tags'],
  messages: DiaryStore['messages'],
): ChatboxData | null => {
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
    preview: getMessagePreview(lastMessage as Message | null | undefined),
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
};

export type SidebarRowView =
  | {
      type: 'group';
      row: Extract<SidebarRow, { type: 'group' }>;
      data: GroupData;
    }
  | {
      type: 'chatbox';
      row: Extract<SidebarRow, { type: 'chatbox' }>;
      data: ChatboxData;
    };

export const useSidebarRowViews = (
  rows: readonly SidebarRow[],
): SidebarRowView[] => {
  const { groups, chatboxes, tags, messages } = useDiaryStore([
    'groups',
    'chatboxes',
    'tags',
    'messages',
  ]);

  return useMemo(() => {
    return rows
      .map((row): SidebarRowView | null => {
        if (row.type === 'group') {
          const group = groups[row.id];

          if (!group) {
            return null;
          }

          const mappedChatboxes = row.chatboxIds
            .map((chatboxId) =>
              mapChatbox(chatboxId, chatboxes, tags, messages),
            )
            .filter((chatbox): chatbox is ChatboxData => chatbox !== null);

          return {
            type: 'group',
            row,
            data: {
              id: group.id,
              title: group.name,
              brushColor: group.color,
              groupIcon: resolveFaIcon(group.icon),
              chatboxes: mappedChatboxes,
            },
          };
        }

        const chatbox = mapChatbox(row.id, chatboxes, tags, messages);

        if (!chatbox) {
          return null;
        }

        return {
          type: 'chatbox',
          row,
          data: chatbox,
        };
      })
      .filter((view): view is SidebarRowView => view !== null);
  }, [rows, groups, chatboxes, tags, messages]);
};

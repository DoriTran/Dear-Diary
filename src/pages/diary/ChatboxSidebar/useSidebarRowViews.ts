import { useMemo } from 'react';

import { resolvePalette } from '@/packages/color';
import { normalizeIconId } from '@/packages/icon';
import { useAppStore, useDiaryStore } from '@/store';

import type { ChatboxData, GroupData } from '../types';
import type { SidebarRow } from './sidebar.types';

import { mapChatboxData } from './Chatbox/chatbox.utils';

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
  const mode = useAppStore('mode');
  const { groups, chatboxes, tags, messages, customPalettes } = useDiaryStore([
    'groups',
    'chatboxes',
    'tags',
    'messages',
    'customPalettes',
  ]);

  return useMemo(() => {
    const mapOptions = {
      mode,
      customPalettes,
    };

    return rows
      .map((row): SidebarRowView | null => {
        if (row.type === 'group') {
          const group = groups[row.id];

          if (!group) {
            return null;
          }

          const groupPalette = resolvePalette(
            group.colorId,
            mode,
            customPalettes,
          );

          const mappedChatboxes = row.chatboxIds
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
            type: 'group',
            row,
            data: {
              id: group.id,
              title: group.name,
              brushColor: groupPalette.main,
              groupIcon: normalizeIconId(group.icon),
              chatboxes: mappedChatboxes,
            },
          };
        }

        const chatbox = chatboxes[row.id];

        if (!chatbox) {
          return null;
        }

        const lastMessage = chatbox.lastMessageId
          ? messages[chatbox.lastMessageId]
          : null;

        return {
          type: 'chatbox',
          row,
          data: mapChatboxData(chatbox, tags, lastMessage, mapOptions),
        };
      })
      .filter((view): view is SidebarRowView => view !== null);
  }, [rows, groups, chatboxes, tags, messages, customPalettes, mode]);
};

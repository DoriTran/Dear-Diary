import { useMemo } from 'react';

import { resolvePalette } from '@/packages/color';
import { normalizeIconId, type IconId } from '@/packages/icon';
import { useDiaryStore, useSettingsStore } from '@/store';

import { formatHeaderActivityAt } from '../../ChatboxSidebar/Chatbox/chatbox.utils';

export type MessageHeaderData = {
  id: string;
  name: string;
  description: string;
  icon: IconId;
  paletteSoft: string;
  paletteMain: string;
  paletteStrong: string;
  iconBg: string;
  pinned: boolean;
  groupName: string | null;
  totalMessage: number;
  updatedLabel: string;
  updatedAt: string | null;
};

export const useMessageHeaderData = (
  chatboxId: string,
): MessageHeaderData | null => {
  const mode = useSettingsStore('mode');
  const { chatboxes, groups, customPalettes } = useDiaryStore([
    'chatboxes',
    'groups',
    'customPalettes',
  ]);

  return useMemo(() => {
    const chatbox = chatboxes[chatboxId];

    if (!chatbox) {
      return null;
    }

    const palette = resolvePalette(chatbox.colorId, mode, customPalettes);
    const group = chatbox.groupId ? groups[chatbox.groupId] : null;
    const hasMessages = chatbox.totalMessage > 0;
    const activityAt = hasMessages
      ? (chatbox.updatedAt ?? chatbox.lastMessageAt)
      : chatbox.createdAt;

    return {
      id: chatbox.id,
      name: chatbox.name,
      description: chatbox.description,
      icon: normalizeIconId(chatbox.icon),
      paletteSoft: palette.soft,
      paletteMain: palette.main,
      paletteStrong: palette.strong,
      iconBg: palette.soft,
      pinned: chatbox.pinned,
      groupName: group?.name ?? null,
      totalMessage: chatbox.totalMessage,
      updatedLabel: formatHeaderActivityAt(
        activityAt,
        hasMessages ? 'updated' : 'created',
      ),
      updatedAt: activityAt,
    };
  }, [chatboxId, chatboxes, customPalettes, groups, mode]);
};

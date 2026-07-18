import { useMemo } from 'react';

import { useDiaryStore, useSettingsStore } from '@/store';

import {
  collectDetailPanelMedia,
  computeDetailPanelStats,
  getArchivedMessages,
  getChatboxMessages,
  getPinnedMessages,
  resolveChatboxIdentity,
  resolveDetailPanelTags,
  type DetailPanelIdentity,
  type DetailPanelMediaItem,
  type DetailPanelStats,
  type DetailPanelTag,
} from './detailPanel.utils';

export type DetailPanelData = {
  identity: DetailPanelIdentity | null;
  stats: DetailPanelStats | null;
  tags: DetailPanelTag[];
  topTags: DetailPanelTag[];
  mediaItems: DetailPanelMediaItem[];
  pinnedMessages: ReturnType<typeof getPinnedMessages>;
  archivedMessages: ReturnType<typeof getArchivedMessages>;
  allMessages: ReturnType<typeof getChatboxMessages>;
};

const TOP_TAG_LIMIT = 5;

export const useDetailPanelData = (chatboxId: string): DetailPanelData => {
  const mode = useSettingsStore('mode');
  const { chatboxes, messages, tags, orders, customPalettes } = useDiaryStore([
    'chatboxes',
    'messages',
    'tags',
    'orders',
    'customPalettes',
  ]);

  return useMemo(() => {
    const chatbox = chatboxes[chatboxId];

    if (!chatbox) {
      return {
        identity: null,
        stats: null,
        tags: [],
        topTags: [],
        mediaItems: [],
        pinnedMessages: [],
        archivedMessages: [],
        allMessages: [],
      };
    }

    const allMessages = getChatboxMessages(chatboxId, messages, orders);
    const resolvedTags = resolveDetailPanelTags(chatbox, tags);

    return {
      identity: resolveChatboxIdentity(chatbox, mode, customPalettes),
      stats: computeDetailPanelStats(chatbox, allMessages),
      tags: resolvedTags,
      topTags: resolvedTags.slice(0, TOP_TAG_LIMIT),
      mediaItems: collectDetailPanelMedia(allMessages),
      pinnedMessages: getPinnedMessages(allMessages),
      archivedMessages: getArchivedMessages(allMessages),
      allMessages,
    };
  }, [chatboxId, chatboxes, messages, orders, tags, mode, customPalettes]);
};

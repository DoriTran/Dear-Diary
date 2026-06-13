import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import {
  faQuestion,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';

import { useDiaryStore } from '@/store';

import {
  buildIconBackground,
  formatHeaderUpdatedAt,
} from '../../ChatboxSidebar/Chatbox/chatbox.utils';

const resolveFaIcon = (icon: string): IconDefinition => {
  return (
    (solidIcons as unknown as Record<string, IconDefinition>)[icon] ||
    faQuestion
  );
};

export type MessageHeaderData = {
  id: string;
  name: string;
  description: string;
  icon: IconDefinition;
  color: string;
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
  const { chatboxes, groups } = useDiaryStore(['chatboxes', 'groups']);

  return useMemo(() => {
    const chatbox = chatboxes[chatboxId];

    if (!chatbox) {
      return null;
    }

    const activityAt =
      chatbox.updatedAt ?? chatbox.lastMessageAt ?? chatbox.createdAt;

    const group = chatbox.groupId ? groups[chatbox.groupId] : null;

    return {
      id: chatbox.id,
      name: chatbox.name,
      description: chatbox.description,
      icon: resolveFaIcon(chatbox.icon),
      color: chatbox.color,
      iconBg: buildIconBackground(chatbox.color),
      pinned: chatbox.pinned,
      groupName: group?.name ?? null,
      totalMessage: chatbox.totalMessage,
      updatedLabel: formatHeaderUpdatedAt(activityAt),
      updatedAt: activityAt,
    };
  }, [chatboxId, chatboxes, groups]);
};

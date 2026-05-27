import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type DiaryFilterTab = 'all' | 'pinned' | 'recent' | 'archived';

export type TagTone = 'purple' | 'pink' | 'yellow' | 'teal' | 'blue';

export type ChatboxTag = {
  label: string;
  tone?: TagTone;
};

export type ChatboxData = {
  id: string;
  title: string;
  preview: string;
  tags?: ChatboxTag[];
  icon: IconDefinition;
  iconBg: string;
  pinned?: boolean;
  timestamp: string;
  unreadCount?: number;
};

export type GroupData = {
  id: string;
  title: string;
  brushColor: string;
  groupIcon: IconDefinition;
  chatboxes: ChatboxData[];
};

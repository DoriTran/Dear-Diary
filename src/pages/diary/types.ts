import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

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

export type DiaryFilterTab = 'all' | 'pinned' | 'recent' | 'archived';

export type MessageAuthor = 'ai' | 'user';

export type MessageTextBlock = {
  type: 'text';
  content: string;
};

export type MessageListBlock = {
  type: 'list';
  items: string[];
};

export type MessageTimerBlock = {
  type: 'timer';
  label: string;
  duration: string;
};

export type MessageBlock =
  | MessageTextBlock
  | MessageListBlock
  | MessageTimerBlock;

export type MessageItem = {
  id: string;
  author: MessageAuthor;
  blocks: MessageBlock[];
  time: string;
  reaction?: { emoji: string; count: number };
  read?: boolean;
};

export type MessageDayGroup = {
  date: string;
  messages: MessageItem[];
};

export type MessageThreadData = {
  chatboxId: string;
  groups: MessageDayGroup[];
};

export type ChatboxDetailData = {
  id: string;
  title: string;
  subtitle: string;
  tags: ChatboxTag[];
  notificationCount?: number;
};

export type MediaFilter = 'all' | 'images' | 'videos' | 'links' | 'files';

export type MediaItemType = 'image' | 'video' | 'link' | 'file' | 'add';

export type MediaItem = {
  id: string;
  type: MediaItemType;
  label?: string;
  duration?: string;
  thumbnail?: string;
};

export type DetailTag = {
  label: string;
  count: number;
  tone?: TagTone;
};

export type PinnedTodo = {
  id: string;
  text: string;
  checked: boolean;
  date?: string;
};

export type PinnedLink = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  reaction?: { emoji: string; count: number };
};

export type DetailPanelData = {
  chatboxId: string;
  media: MediaItem[];
  mediaTotal: number;
  tags: DetailTag[];
  summary: string;
  pinnedTodos: PinnedTodo[];
  pinnedLinks: PinnedLink[];
  pinnedTotal: number;
};

export type DetailPanelTab = 'media' | 'tags' | 'pinned' | 'summary';

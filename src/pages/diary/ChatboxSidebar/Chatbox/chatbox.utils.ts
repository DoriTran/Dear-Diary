import type { Message } from '@/store/diary/type';

export type ResolvedChatboxTag = {
  label: string;
  count: number;
  color: string;
};

export const buildIconBackground = (color: string) =>
  `color-mix(in srgb, ${color} 22%, var(--surface))`;

export const buildTagBackground = (color: string) =>
  `color-mix(in srgb, ${color} 26%, var(--surface))`;

export const formatTotalMessages = (value: number): string => {
  if (value < 1000) {
    return String(value);
  }

  const compact = Math.floor(value / 100) / 10;
  const formatted = Number.isInteger(compact)
    ? String(compact)
    : compact.toFixed(1);

  return `${formatted}k`;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isYesterday = (date: Date, now: Date) => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  return isSameDay(date, yesterday);
};

export const formatChatboxTime = (iso: string | null): string => {
  if (!iso) {
    return '';
  }

  const date = new Date(iso);
  const now = new Date();

  if (isSameDay(date, now)) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  if (isYesterday(date, now)) {
    return 'Yesterday';
  }

  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getMessagePreview = (
  message: Message | null | undefined,
): string => {
  if (!message) {
    return '';
  }

  switch (message.type) {
    case 'text':
    case 'ai':
      return message.content.text;
    case 'image':
      return 'Photo';
    case 'video':
      return 'Video';
    case 'todo': {
      const first = message.content.items[0];

      return first ? `Todo: ${first.label}` : 'Todo list';
    }
    case 'ticket':
      return message.content.title;
    case 'countdown':
      return message.content.title;
    default:
      return '';
  }
};

export const sortTagsByCount = (
  tags: ResolvedChatboxTag[],
): ResolvedChatboxTag[] => [...tags].sort((a, b) => b.count - a.count);

export const getVisibleTags = (
  tags: ResolvedChatboxTag[],
  maxVisible = 3,
): { visible: ResolvedChatboxTag[]; overflowCount: number } => {
  if (tags.length <= maxVisible) {
    return { visible: tags, overflowCount: 0 };
  }

  return {
    visible: tags.slice(0, maxVisible),
    overflowCount: tags.length - maxVisible,
  };
};

export const calculateFittingTagCount = (
  tagWidths: number[],
  containerWidth: number,
  gap: number,
  overflowChipWidth: number,
): { visibleCount: number; overflowCount: number } => {
  const total = tagWidths.length;

  if (total === 0 || containerWidth <= 0) {
    return { visibleCount: 0, overflowCount: 0 };
  }

  const totalWidth =
    tagWidths.reduce((sum, width) => sum + width, 0) + gap * (total - 1);

  if (totalWidth <= containerWidth) {
    return { visibleCount: total, overflowCount: 0 };
  }

  for (let visible = total - 1; visible >= 1; visible -= 1) {
    const overflow = total - visible;
    const tagsWidth =
      tagWidths.slice(0, visible).reduce((sum, width) => sum + width, 0) +
      gap * (visible - 1);
    const needed = tagsWidth + gap + overflowChipWidth;

    if (needed <= containerWidth) {
      return { visibleCount: visible, overflowCount: overflow };
    }
  }

  if (overflowChipWidth <= containerWidth) {
    return { visibleCount: 0, overflowCount: total };
  }

  return { visibleCount: 0, overflowCount: total };
};

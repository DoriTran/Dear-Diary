import type { Message } from '@/store/diary/type';

export type MessageDayGroup = {
  date: string;
  messages: Message[];
};

export const formatMessageTime = (iso: string): string => {
  const date = new Date(iso);

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDayLabel = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

export const groupMessagesByDay = (messages: Message[]): MessageDayGroup[] => {
  const groups = new Map<string, Message[]>();

  for (const message of messages) {
    const dayKey = new Date(message.createdAt).toDateString();
    const bucket = groups.get(dayKey) ?? [];
    bucket.push(message);
    groups.set(dayKey, bucket);
  }

  return Array.from(groups.entries()).map(([, dayMessages]) => ({
    date: formatDayLabel(dayMessages[0].createdAt),
    messages: dayMessages,
  }));
};

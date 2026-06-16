import type { Chatbox } from '@/store/diary/type';

export const getLatestUpdatedChatboxes = (
  chatboxes: Record<string, Chatbox>,
  limit = 3,
): Chatbox[] =>
  Object.values(chatboxes)
    .filter((chatbox) => !chatbox.archived)
    .sort((a, b) => {
      const aTime = new Date(
        a.lastMessageAt ?? a.updatedAt ?? a.createdAt,
      ).getTime();
      const bTime = new Date(
        b.lastMessageAt ?? b.updatedAt ?? b.createdAt,
      ).getTime();

      return bTime - aTime;
    })
    .slice(0, limit);

export const getTotalMessageCount = (
  chatboxes: Record<string, Chatbox>,
): number =>
  Object.values(chatboxes).reduce(
    (sum, chatbox) => sum + chatbox.totalMessage,
    0,
  );

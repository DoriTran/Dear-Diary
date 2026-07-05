import { useCallback, useState } from 'react';

import { useDiaryStore } from '@/store';

import type { MessageScrollAPI } from './useMessageScroll';

export type MessageActionsAPI = {
  startReply: (messageId: string) => void;
  cancelReply: () => void;
  replyToMessageId: string | null;
  toggleReaction: (messageId: string, emoji: string) => void;
  togglePin: (messageId: string) => void;
  toggleArchive: (messageId: string) => void;
  setTags: (messageId: string, tagIds: string[]) => void;
  requestDelete: (messageId: string) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
  deleteTargetId: string | null;
  requestForward: (messageId: string) => void;
  confirmForward: (targetChatboxId: string, caption?: string) => void;
  cancelForward: () => void;
  forwardSourceId: string | null;
  navigateToMessage: (messageId: string) => void;
};

type UseMessageActionsOptions = {
  chatboxId: string;
  scroll: MessageScrollAPI;
  onNavigateToChatbox?: (chatboxId: string, messageId: string) => void;
};

export const useMessageActions = ({
  chatboxId,
  scroll,
  onNavigateToChatbox,
}: UseMessageActionsOptions): MessageActionsAPI => {
  const messages = useDiaryStore('messages');
  const toggleMessagePin = useDiaryStore('toggleMessagePin');
  const toggleMessageArchive = useDiaryStore('toggleMessageArchive');
  const toggleMessageReaction = useDiaryStore('toggleMessageReaction');
  const setMessageTags = useDiaryStore('setMessageTags');
  const deleteMessage = useDiaryStore('deleteMessage');
  const forwardMessage = useDiaryStore('forwardMessage');

  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [forwardSourceId, setForwardSourceId] = useState<string | null>(null);

  const navigateToMessage = useCallback(
    (messageId: string) => {
      const target = messages[messageId];

      if (!target) {
        return;
      }

      if (target.chatboxId !== chatboxId) {
        onNavigateToChatbox?.(target.chatboxId, messageId);
        return;
      }

      scroll.scrollToMessage(messageId);
    },
    [chatboxId, messages, onNavigateToChatbox, scroll],
  );

  return {
    replyToMessageId,
    deleteTargetId,
    forwardSourceId,
    startReply: setReplyToMessageId,
    cancelReply: () => setReplyToMessageId(null),
    toggleReaction: toggleMessageReaction,
    togglePin: toggleMessagePin,
    toggleArchive: toggleMessageArchive,
    setTags: setMessageTags,
    requestDelete: setDeleteTargetId,
    confirmDelete: () => {
      if (deleteTargetId) {
        deleteMessage(deleteTargetId);
      }

      setDeleteTargetId(null);
    },
    cancelDelete: () => setDeleteTargetId(null),
    requestForward: setForwardSourceId,
    confirmForward: (targetChatboxId, caption) => {
      if (forwardSourceId) {
        forwardMessage(forwardSourceId, targetChatboxId, caption);
      }

      setForwardSourceId(null);
    },
    cancelForward: () => setForwardSourceId(null),
    navigateToMessage,
  };
};

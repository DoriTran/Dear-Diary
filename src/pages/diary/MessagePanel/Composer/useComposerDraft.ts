import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  Attachment,
  MessageDecoration,
  MessageType,
} from '@/store/diary/type';

import { generateAiResponse, uploadAttachment } from '@/api';
import { useDiaryStore } from '@/store';

import {
  createInitialDraft,
  createEmptyTodoItem,
  type ComposerDraft,
  type ComposerEditorRef,
  type DraftTodoItem,
  type PendingTypeSwitch,
} from './composer.types';
import {
  buildMessagePayload,
  convertDraftToType,
  createCountdownDecoration,
  createTicketDecoration,
  draftHasTypeContent,
  fileToAttachmentType,
  hasDraftContent,
} from './composer.utils';
import { syncLinkAttachments } from './linkAttachments.utils';

export const useComposerDraft = (
  chatboxId: string,
  options?: {
    replyToMessageId?: string | null;
    onReplyClear?: () => void;
  },
) => {
  const createMessage = useDiaryStore('createMessage');
  const [draft, setDraft] = useState<ComposerDraft>(createInitialDraft);
  const [pendingTypeSwitch, setPendingTypeSwitch] =
    useState<PendingTypeSwitch>(null);
  const [sending, setSending] = useState(false);
  const editorRef = useRef<ComposerEditorRef | null>(null);

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      replyToMessageId: options?.replyToMessageId ?? null,
    }));
  }, [options?.replyToMessageId]);

  const setFocused = useCallback((focused: boolean) => {
    setDraft((current) => ({ ...current, focused }));
  }, []);

  const setText = useCallback((text: string) => {
    setDraft((current) => ({
      ...current,
      text,
      attachments: syncLinkAttachments(text, current.attachments),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setDraft(createInitialDraft());
  }, []);

  const applyTypeSwitch = useCallback((nextType: MessageType) => {
    setDraft((current) => ({
      ...current,
      ...convertDraftToType(current, nextType),
    }));
    setPendingTypeSwitch(null);
  }, []);

  const requestTypeSwitch = useCallback(
    (nextType: MessageType) => {
      if (nextType === draft.type && nextType !== 'text') {
        applyTypeSwitch('text');
        return;
      }

      if (nextType === draft.type) {
        return;
      }

      if (draftHasTypeContent(draft)) {
        setPendingTypeSwitch({ nextType });
        return;
      }

      applyTypeSwitch(nextType);
    },
    [applyTypeSwitch, draft],
  );

  const toggleDecoration = useCallback((type: MessageDecoration['type']) => {
    setDraft((current) => {
      const exists = current.decorations.some(
        (decoration) => decoration.type === type,
      );

      if (exists) {
        return {
          ...current,
          decorations: current.decorations.filter(
            (decoration) => decoration.type !== type,
          ),
        };
      }

      const decoration =
        type === 'ticket'
          ? createTicketDecoration()
          : createCountdownDecoration();

      return {
        ...current,
        decorations: [...current.decorations, decoration],
      };
    });
  }, []);

  const updateDecoration = useCallback(
    (index: number, decoration: MessageDecoration) => {
      setDraft((current) => ({
        ...current,
        decorations: current.decorations.map((item, itemIndex) =>
          itemIndex === index ? decoration : item,
        ),
      }));
    },
    [],
  );

  const removeAttachment = useCallback((attachmentId: string) => {
    setDraft((current) => ({
      ...current,
      attachments: current.attachments.filter(
        (attachment) => attachment.id !== attachmentId,
      ),
    }));
  }, []);

  const addFiles = useCallback(
    async (files: FileList | File[], kind: 'file' | 'image' | 'video') => {
      const fileList = Array.from(files);

      for (const file of fileList) {
        const blobUrl = URL.createObjectURL(file);
        const attachmentType = fileToAttachmentType(file, kind);
        const tempId = `att:${uuidv4()}`;

        const tempAttachment: Attachment =
          attachmentType === 'image'
            ? {
                id: tempId,
                type: 'image',
                url: blobUrl,
                name: file.name,
              }
            : attachmentType === 'video'
              ? {
                  id: tempId,
                  type: 'video',
                  url: blobUrl,
                  name: file.name,
                }
              : {
                  id: tempId,
                  type: 'file',
                  url: blobUrl,
                  name: file.name,
                  mimeType: file.type || 'application/octet-stream',
                  size: file.size,
                };

        setDraft((current) => ({
          ...current,
          attachments: [...current.attachments, tempAttachment],
        }));

        try {
          const result = await uploadAttachment(file);
          URL.revokeObjectURL(blobUrl);

          setDraft((current) => ({
            ...current,
            attachments: current.attachments.map((attachment) =>
              attachment.id === tempId
                ? attachment.type === 'image'
                  ? {
                      ...attachment,
                      url: result.url,
                      name: result.name,
                    }
                  : attachment.type === 'video'
                    ? {
                        ...attachment,
                        url: result.url,
                        name: result.name,
                      }
                    : {
                        ...attachment,
                        url: result.url,
                        name: result.name,
                        mimeType: result.mimeType,
                        size: result.size,
                      }
                : attachment,
            ),
          }));
        } catch {
          // Keep blob URL as fallback
        }
      }
    },
    [],
  );

  const addTodoRow = useCallback(() => {
    setDraft((current) => ({
      ...current,
      todoItems: [...current.todoItems, createEmptyTodoItem()],
    }));
  }, []);

  const updateTodoItem = useCallback(
    (itemId: string, patch: Partial<DraftTodoItem>) => {
      setDraft((current) => ({
        ...current,
        todoItems: current.todoItems.map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          const nextItem = { ...item, ...patch };

          if (patch.text !== undefined) {
            nextItem.attachments = syncLinkAttachments(
              nextItem.text,
              nextItem.attachments,
            );
          }

          return nextItem;
        }),
      }));
    },
    [],
  );

  const removeTodoRow = useCallback((itemId: string) => {
    setDraft((current) => {
      const nextItems = current.todoItems.filter((item) => item.id !== itemId);
      return {
        ...current,
        todoItems: nextItems.length > 0 ? nextItems : [createEmptyTodoItem()],
      };
    });
  }, []);

  const addTodoRowFiles = useCallback(
    async (itemId: string, files: FileList | File[]) => {
      const fileList = Array.from(files);

      for (const file of fileList) {
        const blobUrl = URL.createObjectURL(file);
        const attachmentType = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : 'file';
        const tempId = `att:${uuidv4()}`;

        const tempAttachment: Attachment =
          attachmentType === 'image'
            ? { id: tempId, type: 'image', url: blobUrl, name: file.name }
            : attachmentType === 'video'
              ? { id: tempId, type: 'video', url: blobUrl, name: file.name }
              : {
                  id: tempId,
                  type: 'file',
                  url: blobUrl,
                  name: file.name,
                  mimeType: file.type || 'application/octet-stream',
                  size: file.size,
                };

        setDraft((current) => ({
          ...current,
          todoItems: current.todoItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  attachments: [...item.attachments, tempAttachment],
                }
              : item,
          ),
        }));

        try {
          const result = await uploadAttachment(file);
          URL.revokeObjectURL(blobUrl);

          setDraft((current) => ({
            ...current,
            todoItems: current.todoItems.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    attachments: item.attachments.map((attachment) =>
                      attachment.id === tempId
                        ? { ...attachment, url: result.url, name: result.name }
                        : attachment,
                    ),
                  }
                : item,
            ),
          }));
        } catch {
          // Keep blob URL
        }
      }
    },
    [],
  );

  const removeTodoRowAttachment = useCallback(
    (itemId: string, attachmentId: string) => {
      setDraft((current) => ({
        ...current,
        todoItems: current.todoItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                attachments: item.attachments.filter(
                  (attachment) => attachment.id !== attachmentId,
                ),
              }
            : item,
        ),
      }));
    },
    [],
  );

  const send = useCallback(async () => {
    const payload = buildMessagePayload(draft, chatboxId);

    if (!payload || sending) {
      return;
    }

    setSending(true);

    try {
      const prompt =
        payload.type === 'ai' && payload.content?.text
          ? payload.content.text
          : '';

      createMessage(payload);

      if (payload.type === 'ai' && prompt) {
        const response = await generateAiResponse({ chatboxId, prompt });

        createMessage({
          chatboxId,
          sender: 'assistant',
          type: 'text',
          content: {
            text: response.list
              ? `${response.text}\n\n${response.list.map((item) => `• ${item}`).join('\n')}`
              : response.text,
          },
          attachments: [],
          decorations: [],
          tagIds: [],
          pinned: false,
          archived: false,
          replyToMessageId: null,
          sourceMessageId: null,
          reactions: [],
        });
      }

      setDraft(createInitialDraft());
      options?.onReplyClear?.();
    } finally {
      setSending(false);
    }
  }, [chatboxId, createMessage, draft, options, sending]);

  const insertReactionIcon = useCallback((icon: string) => {
    editorRef.current?.insertAtCursor(icon);
  }, []);

  return {
    draft,
    editorRef,
    sending,
    pendingTypeSwitch,
    setFocused,
    setText,
    clearAll,
    requestTypeSwitch,
    applyTypeSwitch,
    cancelTypeSwitch: () => setPendingTypeSwitch(null),
    toggleDecoration,
    updateDecoration,
    removeAttachment,
    addFiles,
    addTodoRow,
    updateTodoItem,
    removeTodoRow,
    addTodoRowFiles,
    removeTodoRowAttachment,
    send,
    insertReactionIcon,
    canSend: hasDraftContent(draft) && !sending,
  };
};

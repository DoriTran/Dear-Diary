import type { FC } from 'react';

import ActionBar from './ActionBar/ActionBar';
import AttachmentTray from './AttachmentTray/AttachmentTray';
import DecoratedEditor from './DecoratedEditor/DecoratedEditor';
import AIEditor from './editors/AIEditor';
import TextEditor from './editors/TextEditor';
import TodoEditor from './editors/TodoEditor';
import styles from './MessageComposer.module.css';
import ReactionIconPicker from './ReactionIconPicker';
import ReplyPreviewInput from './ReplyPreviewInput';
import TypeSwitchModal from './TypeSwitchModal';
import { useComposerDraft } from './useComposerDraft';

export type MessageComposerProps = {
  chatboxId: string;
  replyToMessageId?: string | null;
  onCancelReply?: () => void;
  onNavigateToMessage?: (messageId: string) => void;
};

const MessageComposer: FC<MessageComposerProps> = ({
  chatboxId,
  replyToMessageId = null,
  onCancelReply,
  onNavigateToMessage,
}) => {
  const {
    draft,
    editorRef,
    pendingTypeSwitch,
    setFocused,
    setText,
    clearAll,
    requestTypeSwitch,
    applyTypeSwitch,
    cancelTypeSwitch,
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
    canSend,
  } = useComposerDraft(chatboxId, {
    replyToMessageId,
    onReplyClear: onCancelReply,
  });

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    window.setTimeout(() => setFocused(false), 100);
  };

  const handleAddFiles = (
    files: FileList | File[],
    kind: 'file' | 'image' | 'video',
  ) => {
    void addFiles(files, kind);
  };

  const handleTodoAddFiles = (itemId: string, files: FileList | File[]) => {
    void addTodoRowFiles(itemId, files);
  };

  const renderEditor = () => {
    if (draft.type === 'todo') {
      return (
        <TodoEditor
          items={draft.todoItems}
          onUpdateItem={updateTodoItem}
          onRemoveItem={removeTodoRow}
          onAddRow={addTodoRow}
          onAddFiles={handleTodoAddFiles}
          onRemoveAttachment={removeTodoRowAttachment}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      );
    }

    if (draft.type === 'ai') {
      return (
        <AIEditor
          editorRef={editorRef}
          value={draft.text}
          onChange={setText}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      );
    }

    return (
      <TextEditor
        ref={editorRef}
        value={draft.text}
        onChange={setText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  };

  return (
    <footer className={styles.root}>
      {replyToMessageId ? (
        <ReplyPreviewInput
          replyToMessageId={replyToMessageId}
          onCancel={() => onCancelReply?.()}
          onJump={(messageId) => onNavigateToMessage?.(messageId)}
        />
      ) : null}

      <AttachmentTray
        attachments={draft.attachments.filter(
          (attachment) => attachment.type !== 'link',
        )}
        focused={draft.focused}
        onRemove={removeAttachment}
        onAddFiles={handleAddFiles}
      />

      <div className={styles.editorArea}>
        <DecoratedEditor
          decorations={draft.decorations}
          composing
          onUpdateDecoration={updateDecoration}
        >
          {renderEditor()}
        </DecoratedEditor>
      </div>

      <ActionBar
        type={draft.type}
        decorations={draft.decorations}
        canSend={canSend}
        onClear={clearAll}
        onAddFiles={handleAddFiles}
        onToggleDecoration={toggleDecoration}
        onTypeSwitch={requestTypeSwitch}
        reactionPicker={
          draft.type === 'text' || draft.type === 'ai' ? (
            <ReactionIconPicker onSelect={insertReactionIcon} />
          ) : null
        }
        onSend={() => void send()}
      />

      <TypeSwitchModal
        nextType={pendingTypeSwitch?.nextType ?? null}
        onConfirm={() => {
          if (pendingTypeSwitch) {
            applyTypeSwitch(pendingTypeSwitch.nextType);
          }
        }}
        onCancel={cancelTypeSwitch}
      />
    </footer>
  );
};

export default MessageComposer;

import type { FC } from 'react';

import AttachmentTray from '../Composer/AttachmentTray/AttachmentTray';
import AIEditor from '../Composer/editors/AIEditor';
import TextEditor from '../Composer/editors/TextEditor';
import TodoEditor from '../Composer/editors/TodoEditor';
import styles from '../Composer/MessageComposer.module.css';
import ReactionIconPicker from '../Composer/ReactionIconPicker';
import ReplyPreviewInput from '../Composer/ReplyPreviewInput';
import TypeSwitchModal from '../Composer/TypeSwitchModal';
import { useComposerDraft } from '../Composer/useComposerDraft';
import ActionDock from './ActionDock';
import DecoratedSurface from './DecoratedSurface/DecoratedSurface';

export type DiaryInputProps = {
  chatboxId: string;
  replyToMessageId?: string | null;
  onCancelReply?: () => void;
  onNavigateToMessage?: (messageId: string) => void;
};

const DiaryInput: FC<DiaryInputProps> = ({
  chatboxId,
  replyToMessageId = null,
  onCancelReply,
  onNavigateToMessage,
}) => {
  const {
    draft,
    editorRef,
    pendingVariantSwitch,
    setFocused,
    setText,
    clearAll,
    requestVariantSwitch,
    applyVariantSwitch,
    cancelVariantSwitch,
    toggleDecorator,
    updateDecorator,
    updateDraft,
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
    if (draft.variant === 'todo') {
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

    if (draft.variant === 'ai') {
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
        maxRows={5}
        onChange={setText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  };

  const fileAttachments = draft.attachments.filter(
    (attachment) => attachment.type !== 'link',
  );

  return (
    <footer className={styles.root}>
      {replyToMessageId ? (
        <ReplyPreviewInput
          replyToMessageId={replyToMessageId}
          onCancel={() => onCancelReply?.()}
          onJump={(messageId) => onNavigateToMessage?.(messageId)}
        />
      ) : null}

      <div className={styles.dock}>
        <div className={styles.editorStack}>
          <AttachmentTray
            attachments={fileAttachments}
            focused={draft.focused}
            onRemove={removeAttachment}
            onAddFiles={handleAddFiles}
          />

          <div className={styles.composerCard}>
            <DecoratedSurface
              draft={draft}
              composing
              borderless
              updateDecorator={updateDecorator}
              updateDraft={updateDraft}
            >
              {renderEditor()}
            </DecoratedSurface>
          </div>
        </div>

        <ActionDock
          variant={draft.variant}
          decorators={draft.decorators}
          canSend={canSend}
          onClear={clearAll}
          onAddFiles={handleAddFiles}
          onToggleDecorator={toggleDecorator}
          onVariantSwitch={requestVariantSwitch}
          reactionPicker={
            draft.variant === 'text' || draft.variant === 'ai' ? (
              <ReactionIconPicker onSelect={insertReactionIcon} />
            ) : null
          }
          onSend={() => void send()}
        />
      </div>

      <TypeSwitchModal
        nextVariant={pendingVariantSwitch?.nextVariant ?? null}
        onConfirm={() => {
          if (pendingVariantSwitch) {
            applyVariantSwitch(pendingVariantSwitch.nextVariant);
          }
        }}
        onCancel={cancelVariantSwitch}
      />
    </footer>
  );
};

export default DiaryInput;

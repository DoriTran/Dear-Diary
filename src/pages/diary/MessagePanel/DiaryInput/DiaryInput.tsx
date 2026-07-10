import type { FC } from 'react';

import ActionDock from './actions/ActionDock/ActionDock';
import ReactionIconPicker from './actions/ReactionIconPicker';
import AttachmentTray from './attachment/AttachmentTray/AttachmentTray';
import DecoratedSurface from './decorator/DecoratedSurface/DecoratedSurface';
import styles from './DiaryInput.module.css';
import ReplyPreviewInput from './input/ReplyPreviewInput';
import { useComposerDraft } from './input/useComposerDraft';
import AIEditor from './variant/editors/AIEditor';
import TextEditor from './variant/editors/TextEditor';
import TodoEditor from './variant/editors/TodoEditor';
import TypeSwitchModal from './variant/TypeSwitchModal';

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
    (item) => item.type !== 'link',
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

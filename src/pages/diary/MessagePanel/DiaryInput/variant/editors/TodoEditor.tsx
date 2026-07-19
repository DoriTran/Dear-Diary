import {
  faGripVertical,
  faPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

import type { EnterKeyBehavior } from '@/store/settings/type';

import { AdCheckbox, AdDragDrop, AdIcon } from '@/packages/base';

import type { DraftTodoItem } from '../../input/composer.types';
import { useAutoGrowTextarea } from '../../input/useAutoGrowTextarea';

import AttachmentCard from '../../attachment/AttachmentTray/AttachmentCard';
import styles from './TodoEditor.module.css';

const TODO_SORTABLE_GROUP = 'todo-composer-rows';

const findScrollParent = (start: HTMLElement | null): HTMLElement | null => {
  let node = start?.parentElement ?? null;

  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }
    node = node.parentElement;
  }

  return null;
};

export type TodoEditorProps = {
  items: DraftTodoItem[];
  onUpdateItem: (itemId: string, patch: Partial<DraftTodoItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onAddRow: () => void;
  onAddFiles: (itemId: string, files: FileList | File[]) => void;
  onRemoveAttachment: (itemId: string, attachmentId: string) => void;
  onReorderItem: (current: number, previous: number) => void;
  onSubmit?: () => void;
  enterKeyBehavior?: EnterKeyBehavior;
  onFocus?: () => void;
  onBlur?: () => void;
};

type TodoRowTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
  enterKeyBehavior: EnterKeyBehavior;
  completed: boolean;
};

const TodoRowTextarea: FC<TodoRowTextareaProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
  enterKeyBehavior,
  completed,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoGrowTextarea(textareaRef, value, 5);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!onSubmit || event.key !== 'Enter' || event.nativeEvent.isComposing) {
      return;
    }

    const shouldSend =
      enterKeyBehavior === 'enter-sends' ? !event.shiftKey : event.shiftKey;

    if (shouldSend) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className={`${styles.input} ${completed ? styles.inputDone : ''}`}
      value={value}
      placeholder="Todo item..."
      aria-label="Todo item"
      rows={1}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

type SortableTodoRowProps = {
  item: DraftTodoItem;
  canRemove: boolean;
  enterKeyBehavior: EnterKeyBehavior;
  onUpdateItem: (itemId: string, patch: Partial<DraftTodoItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onAddFiles: (itemId: string, files: FileList | File[]) => void;
  onRemoveAttachment: (itemId: string, attachmentId: string) => void;
  onReorderItem: (current: number, previous: number) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

/**
 * Sortable item row — mirrors ChatboxSidebar's SortableChatbox:
 * draggable + sortable + itemOf, with a data-handle grip like Group.
 */
const SortableTodoRow: FC<SortableTodoRowProps> = ({
  item,
  canRemove,
  enterKeyBehavior,
  onUpdateItem,
  onRemoveItem,
  onAddFiles,
  onRemoveAttachment,
  onReorderItem,
  onSubmit,
  onFocus,
  onBlur,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fieldFocused, setFieldFocused] = useState(false);
  // Native file dialog steals focus; keep the attachment row visible until it closes.
  const [pickingFiles, setPickingFiles] = useState(false);
  const hasAttachments = item.attachments.length > 0;
  const showAttachments = hasAttachments || fieldFocused || pickingFiles;

  useEffect(() => {
    if (!pickingFiles) {
      return;
    }

    const handleWindowFocus = () => {
      window.setTimeout(() => setPickingFiles(false), 0);
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [pickingFiles]);

  const handleFieldFocus = () => {
    setFieldFocused(true);
    onFocus?.();
  };

  const handleFieldBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) {
      return;
    }
    setFieldFocused(false);
    onBlur?.();
  };

  const openFilePicker = () => {
    setPickingFiles(true);
    fileInputRef.current?.click();
  };

  return (
    <AdDragDrop
      draggable
      sortable
      itemOf={TODO_SORTABLE_GROUP}
      data={{ kind: 'todo-row', id: item.id }}
      onSortableChange={({ current, previous }) => {
        onReorderItem(current, previous);
      }}
    >
      <div className={styles.row} data-test-id={item.id}>
        <span
          className={styles.dragHandle}
          aria-label="Drag to reorder"
          data-handle
        >
          <AdIcon icon={faGripVertical} size={16} />
        </span>

        <AdCheckbox
          className={styles.checkbox}
          checked={item.completed}
          aria-label={
            item.text ? `Mark ${item.text} complete` : 'Mark todo complete'
          }
          onChange={() =>
            onUpdateItem(item.id, { completed: !item.completed })
          }
        />

        <div
          className={styles.field}
          onFocus={handleFieldFocus}
          onBlur={handleFieldBlur}
        >
          <TodoRowTextarea
            value={item.text}
            completed={item.completed}
            enterKeyBehavior={enterKeyBehavior}
            onChange={(text) => onUpdateItem(item.id, { text })}
            onSubmit={onSubmit}
          />

          {showAttachments ? (
            <div className={styles.rowAttachments}>
              {item.attachments.map((attachment) => (
                <AttachmentCard
                  key={attachment.id}
                  attachment={attachment}
                  variant="tray"
                  hideName
                  dense
                  onRemove={() => onRemoveAttachment(item.id, attachment.id)}
                />
              ))}
              <button
                type="button"
                className={styles.addAttachmentBtn}
                aria-label="Upload file for row"
                onMouseDown={(event) => event.preventDefault()}
                onClick={openFilePicker}
              >
                <AdIcon icon={faPlus} size={12} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className={styles.hiddenInput}
                multiple
                onChange={(event) => {
                  if (event.target.files?.length) {
                    onAddFiles(item.id, event.target.files);
                    event.target.value = '';
                  }
                  setPickingFiles(false);
                }}
              />
            </div>
          ) : null}
        </div>

        {canRemove ? (
          <button
            type="button"
            className={styles.removeBtn}
            aria-label="Remove row"
            onClick={() => onRemoveItem(item.id)}
          >
            <AdIcon icon={faXmark} size={11} />
          </button>
        ) : null}
      </div>
    </AdDragDrop>
  );
};

const TodoEditor: FC<TodoEditorProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddRow,
  onAddFiles,
  onRemoveAttachment,
  onReorderItem,
  onSubmit,
  enterKeyBehavior = 'shift-enter-sends',
  onFocus,
  onBlur,
}) => {
  // Ref on an inner node — AdDragDrop steals the ref on its direct child.
  const addRowBtnRef = useRef<HTMLButtonElement>(null);
  const shouldScrollToBottomRef = useRef(false);

  useLayoutEffect(() => {
    if (!shouldScrollToBottomRef.current) {
      return;
    }
    shouldScrollToBottomRef.current = false;

    const scrollParent = findScrollParent(addRowBtnRef.current);
    if (!scrollParent) {
      return;
    }

    const pinBottom = () => {
      scrollParent.scrollTop = scrollParent.scrollHeight;
    };

    pinBottom();
    // Follow-up after layout/DnD motion settles so height is final.
    requestAnimationFrame(pinBottom);
  }, [items.length]);

  const handleAddRow = () => {
    shouldScrollToBottomRef.current = true;
    onAddRow();
  };

  return (
    <AdDragDrop
      droppable
      sortable
      group={TODO_SORTABLE_GROUP}
      hostPreview
      dropData={{ id: TODO_SORTABLE_GROUP }}
      onSortableChange={({ current, previous }) => {
        onReorderItem(current, previous);
      }}
    >
      <div className={styles.root}>
        <div className={styles.list}>
          {items.map((item) => (
            <SortableTodoRow
              key={item.id}
              item={item}
              canRemove={items.length > 1}
              enterKeyBehavior={enterKeyBehavior}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
              onAddFiles={onAddFiles}
              onRemoveAttachment={onRemoveAttachment}
              onReorderItem={onReorderItem}
              onSubmit={onSubmit}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          ))}
        </div>

        <button
          ref={addRowBtnRef}
          type="button"
          className={styles.addRowBtn}
          onClick={handleAddRow}
        >
          <span className={styles.addRowIcon} aria-hidden>
            <AdIcon icon={faPlus} size={10} />
          </span>
          Add new row
        </button>
      </div>
    </AdDragDrop>
  );
};

export default TodoEditor;

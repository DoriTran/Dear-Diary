import {
  faArrowUpFromBracket,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useRef, type FC } from 'react';

import { AdIcon } from '@/packages/base';

import type { DraftTodoItem } from '../../input/composer.types';

import AttachmentCard from '../../attachment/AttachmentTray/AttachmentCard';
import styles from './TodoEditor.module.css';

export type TodoEditorProps = {
  items: DraftTodoItem[];
  onUpdateItem: (itemId: string, patch: Partial<DraftTodoItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onAddRow: () => void;
  onAddFiles: (itemId: string, files: FileList | File[]) => void;
  onRemoveAttachment: (itemId: string, attachmentId: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const TodoEditor: FC<TodoEditorProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddRow,
  onAddFiles,
  onRemoveAttachment,
  onFocus,
  onBlur,
}) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div className={styles.root}>
      {items.map((item) => (
        <div key={item.id} className={styles.row}>
          <div className={styles.rowMain}>
            <button
              type="button"
              className={styles.uploadBtn}
              aria-label="Upload file for row"
              onClick={() => fileInputRefs.current[item.id]?.click()}
            >
              <AdIcon icon={faArrowUpFromBracket} size={11} />
            </button>
            <input
              ref={(node) => {
                fileInputRefs.current[item.id] = node;
              }}
              type="file"
              className={styles.hiddenInput}
              multiple
              onChange={(event) => {
                if (event.target.files?.length) {
                  onAddFiles(item.id, event.target.files);
                  event.target.value = '';
                }
              }}
            />
            <input
              className={styles.input}
              value={item.text}
              placeholder="Todo item..."
              aria-label="Todo item"
              onChange={(event) =>
                onUpdateItem(item.id, { text: event.target.value })
              }
              onFocus={onFocus}
              onBlur={onBlur}
            />
            {items.length > 1 ? (
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
          {item.attachments.length > 0 ? (
            <div className={styles.rowAttachments}>
              {item.attachments.map((attachment) => (
                <AttachmentCard
                  key={attachment.id}
                  attachment={attachment}
                  compact
                  onRemove={() => onRemoveAttachment(item.id, attachment.id)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}
      <button type="button" className={styles.addRowBtn} onClick={onAddRow}>
        + Add new row
      </button>
    </div>
  );
};

export default TodoEditor;

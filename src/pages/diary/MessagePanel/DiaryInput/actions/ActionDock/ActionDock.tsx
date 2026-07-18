import {
  faCheck,
  faCheckSquare,
  faImage,
  faPaperPlane,
  faPlus,
  faStopwatch,
  faTicket,
  faTrashCan,
  faVideo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useRef, type FC, type ReactNode } from 'react';

import type { MessageDecorator, MessageVariant } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import styles from './ActionDock.module.css';

export type ActionDockProps = {
  variant: MessageVariant;
  decorators: MessageDecorator[];
  canSend: boolean;
  editing?: boolean;
  onClear: () => void;
  onAddFiles: (
    files: FileList | File[],
    kind: 'file' | 'image' | 'video',
  ) => void;
  onToggleDecorator: (type: MessageDecorator['type']) => void;
  onVariantSwitch: (variant: MessageVariant) => void;
  reactionPicker?: ReactNode;
  onSend: () => void;
  onCancelEdit?: () => void;
  onConfirmEdit?: () => void;
};

const ActionDock: FC<ActionDockProps> = ({
  variant,
  decorators,
  canSend,
  editing = false,
  onClear,
  onAddFiles,
  onToggleDecorator,
  onVariantSwitch,
  reactionPicker,
  onSend,
  onCancelEdit,
  onConfirmEdit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const hasTicket = decorators.some((d) => d.type === 'ticket');
  const hasTimer = decorators.some((d) => d.type === 'timer');

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <button
          type="button"
          className={styles.btn}
          aria-label="Clear all"
          onClick={onClear}
        >
          <AdIcon icon={faTrashCan} size={14} />
        </button>
      </div>

      <span className={styles.divider} aria-hidden />

      <div className={styles.group}>
        <button
          type="button"
          className={styles.btn}
          aria-label="Add file"
          onClick={() => fileInputRef.current?.click()}
        >
          <AdIcon icon={faPlus} size={14} />
        </button>
        <button
          type="button"
          className={styles.btn}
          aria-label="Add image"
          onClick={() => imageInputRef.current?.click()}
        >
          <AdIcon icon={faImage} size={14} />
        </button>
        <button
          type="button"
          className={styles.btn}
          aria-label="Add video"
          onClick={() => videoInputRef.current?.click()}
        >
          <AdIcon icon={faVideo} size={14} />
        </button>
      </div>

      <span className={styles.divider} aria-hidden />

      <div className={styles.group}>
        <button
          type="button"
          className={`${styles.btn} ${hasTicket ? styles.btnActiveTicket : ''}`}
          aria-label="Ticket decoration"
          aria-pressed={hasTicket}
          onClick={() => onToggleDecorator('ticket')}
        >
          <AdIcon icon={faTicket} size={14} />
        </button>
        <button
          type="button"
          className={`${styles.btn} ${hasTimer ? styles.btnActiveTimer : ''}`}
          aria-label="Timer decorator"
          aria-pressed={hasTimer}
          onClick={() => onToggleDecorator('timer')}
        >
          <AdIcon icon={faStopwatch} size={14} />
        </button>
      </div>

      <span className={styles.divider} aria-hidden />

      <div className={styles.group}>
        <button
          type="button"
          className={`${styles.btn} ${variant === 'todo' ? styles.btnActiveTodo : ''}`}
          aria-label="Todo type"
          aria-pressed={variant === 'todo'}
          onClick={() => onVariantSwitch('todo')}
        >
          <AdIcon icon={faCheckSquare} size={14} />
        </button>
        <button
          type="button"
          className={`${styles.btn} ${variant === 'ai' ? styles.btnActiveAi : ''}`}
          aria-label="AI type"
          aria-pressed={variant === 'ai'}
          onClick={() => onVariantSwitch('ai')}
        >
          <span className={styles.aiLabel}>AI</span>
        </button>
      </div>

      <span className={styles.divider} aria-hidden />

      <div className={styles.group}>{reactionPicker}</div>

      {editing ? (
        <div className={styles.editActions}>
          <span className={styles.editLabel}>Edit Message</span>
          <button
            type="button"
            className={styles.btn}
            aria-label="Cancel edit"
            onClick={onCancelEdit}
          >
            <AdIcon icon={faXmark} size={14} />
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.sendBtn}`}
            aria-label="Confirm edit"
            disabled={!canSend}
            onClick={onConfirmEdit}
          >
            <AdIcon icon={faCheck} size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`${styles.btn} ${styles.sendBtn}`}
          aria-label="Send message"
          disabled={!canSend}
          onClick={onSend}
        >
          <AdIcon icon={faPaperPlane} size={14} />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className={styles.hiddenInput}
        multiple
        onChange={(event) => {
          if (event.target.files?.length) {
            onAddFiles(event.target.files, 'file');
            event.target.value = '';
          }
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        className={styles.hiddenInput}
        accept="image/*"
        multiple
        onChange={(event) => {
          if (event.target.files?.length) {
            onAddFiles(event.target.files, 'image');
            event.target.value = '';
          }
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        className={styles.hiddenInput}
        accept="video/*"
        multiple
        onChange={(event) => {
          if (event.target.files?.length) {
            onAddFiles(event.target.files, 'video');
            event.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default ActionDock;

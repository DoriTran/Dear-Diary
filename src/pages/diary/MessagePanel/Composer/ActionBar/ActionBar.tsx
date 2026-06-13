import {
  faCheckSquare,
  faImage,
  faPaperPlane,
  faPlus,
  faStopwatch,
  faTicket,
  faTrashCan,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { useRef, type FC, type ReactNode } from 'react';

import type { MessageDecoration, MessageType } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import styles from './ActionBar.module.css';

export type ActionBarProps = {
  type: MessageType;
  decorations: MessageDecoration[];
  canSend: boolean;
  onClear: () => void;
  onAddFiles: (
    files: FileList | File[],
    kind: 'file' | 'image' | 'video',
  ) => void;
  onToggleDecoration: (type: MessageDecoration['type']) => void;
  onTypeSwitch: (type: MessageType) => void;
  reactionPicker?: ReactNode;
  onSend: () => void;
};

const ActionBar: FC<ActionBarProps> = ({
  type,
  decorations,
  canSend,
  onClear,
  onAddFiles,
  onToggleDecoration,
  onTypeSwitch,
  reactionPicker,
  onSend,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const hasTicket = decorations.some((d) => d.type === 'ticket');
  const hasCountdown = decorations.some((d) => d.type === 'countdown');

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
          onClick={() => onToggleDecoration('ticket')}
        >
          <AdIcon icon={faTicket} size={14} />
        </button>
        <button
          type="button"
          className={`${styles.btn} ${hasCountdown ? styles.btnActiveCountdown : ''}`}
          aria-label="Countdown decoration"
          aria-pressed={hasCountdown}
          onClick={() => onToggleDecoration('countdown')}
        >
          <AdIcon icon={faStopwatch} size={14} />
        </button>
      </div>

      <span className={styles.divider} aria-hidden />

      <div className={styles.group}>
        <button
          type="button"
          className={`${styles.btn} ${type === 'todo' ? styles.btnActiveTodo : ''}`}
          aria-label="Todo type"
          aria-pressed={type === 'todo'}
          onClick={() => onTypeSwitch('todo')}
        >
          <AdIcon icon={faCheckSquare} size={14} />
        </button>
        <button
          type="button"
          className={`${styles.btn} ${type === 'ai' ? styles.btnActiveAi : ''}`}
          aria-label="AI type"
          aria-pressed={type === 'ai'}
          onClick={() => onTypeSwitch('ai')}
        >
          <span className={styles.aiLabel}>AI</span>
        </button>
      </div>

      <span className={styles.divider} aria-hidden />

      <div className={styles.group}>{reactionPicker}</div>

      <button
        type="button"
        className={styles.sendBtn}
        aria-label="Send message"
        disabled={!canSend}
        onClick={onSend}
      >
        <AdIcon icon={faPaperPlane} size={14} />
      </button>

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

export default ActionBar;

import type { FC } from 'react';

import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import styles from './ChatboxControl.module.css';

export type ChatboxControlProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  onAttach?: () => void;
};

const ChatboxControl: FC<ChatboxControlProps> = ({
  value,
  placeholder = 'Write something…',
  onChange,
  onSubmit,
  onAttach,
}) => {
  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Add"
        onClick={onAttach}
      >
        <AdIcon icon={faPlus} size="18px" color="var(--text-contrast)" />
      </button>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Send"
        onClick={onSubmit}
      >
        <AdIcon icon={faCheck} size="18px" color="var(--text-contrast)" />
      </button>
    </div>
  );
};

export default ChatboxControl;

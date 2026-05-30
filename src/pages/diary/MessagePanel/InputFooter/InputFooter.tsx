import {
  faCalendar,
  faCheckSquare,
  faClock,
  faImage,
  faPaperPlane,
  faPlus,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import { AdIcon } from '@/packages/base';

import styles from './InputFooter.module.css';

const InputFooter: FC = () => {
  return (
    <footer className={styles.root}>
      <textarea
        className={styles.input}
        placeholder="Write something..."
        rows={2}
        aria-label="Write a message"
      />
      <div className={styles.toolbar}>
        <div className={styles.tools}>
          <button type="button" className={styles.toolBtn} aria-label="Add">
            <AdIcon icon={faPlus} size={14} />
          </button>
          <button type="button" className={styles.toolBtn} aria-label="Image">
            <AdIcon icon={faImage} size={14} />
          </button>
          <button type="button" className={styles.toolBtn} aria-label="Checklist">
            <AdIcon icon={faCheckSquare} size={14} />
          </button>
          <button type="button" className={styles.toolBtn} aria-label="Timer">
            <AdIcon icon={faClock} size={14} />
          </button>
          <button type="button" className={styles.toolBtn} aria-label="Calendar">
            <AdIcon icon={faCalendar} size={14} />
          </button>
          <button type="button" className={styles.toolBtn} aria-label="Tag">
            <AdIcon icon={faTag} size={14} />
          </button>
        </div>
        <button type="button" className={styles.sendBtn} aria-label="Send message">
          <AdIcon icon={faPaperPlane} size={14} />
        </button>
      </div>
    </footer>
  );
};

export default InputFooter;

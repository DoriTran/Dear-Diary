import type { FC } from 'react';

import {
  faFaceSmile,
  faImage,
  faPaperPlane,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';
import MessageBubble from '@/pages/diary/MessagePanel/MessageFeed/MessageRow/MessageBubble/MessageBubble';
import { useSettingsStore } from '@/store';

import styles from './LivePreview.module.css';
import { PREVIEW_MESSAGES } from './previewData';

const noop = () => {};

const LivePreview: FC = () => {
  const { theme, mode } = useSettingsStore(['theme', 'mode']);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <span className={styles.headerEyebrow}>Live Preview</span>
          <h2 className={styles.headerTitle}>My Diary</h2>
        </div>
        <span className={styles.headerBadge}>
          {theme} · {mode}
        </span>
      </div>

      <div className={styles.feed}>
        {PREVIEW_MESSAGES.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onNavigateToMessage={noop}
          />
        ))}
      </div>

      <div className={styles.composer} aria-hidden>
        <span className={styles.composerIcon}>
          <AdIcon icon={faPlus} size={14} />
        </span>
        <span className={styles.composerIcon}>
          <AdIcon icon={faImage} size={14} />
        </span>
        <span className={styles.composerInput}>Write something…</span>
        <span className={styles.composerIcon}>
          <AdIcon icon={faFaceSmile} size={14} />
        </span>
        <span className={styles.composerSend}>
          <AdIcon icon={faPaperPlane} size={13} />
        </span>
      </div>

      <p className={styles.hint}>
        Theme and appearance changes preview here instantly.
      </p>
    </div>
  );
};

export default LivePreview;

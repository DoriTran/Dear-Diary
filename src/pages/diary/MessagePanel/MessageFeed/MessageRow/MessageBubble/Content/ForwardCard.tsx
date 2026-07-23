import type { FC } from 'react';

import { AdEmojiText } from '@/packages/base';
import { useDiaryStore } from '@/store';

import {
  getMessagePreviewText,
  getMessageSenderLabel,
} from '../../../../messagePanel.utils';
import styles from './ForwardCard.module.css';

export type ForwardCardProps = {
  sourceMessageId: string;
  onJump: (messageId: string) => void;
};

const ForwardCard: FC<ForwardCardProps> = ({ sourceMessageId, onJump }) => {
  const messages = useDiaryStore('messages');
  const chatboxes = useDiaryStore('chatboxes');
  const source = messages[sourceMessageId];
  const chatbox = source ? chatboxes[source.chatboxId] : undefined;

  if (!source) {
    return (
      <div className={styles.root}>
        <p className={styles.unavailable}>Message unavailable</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.root}
      onClick={() => onJump(sourceMessageId)}
    >
      <p className={styles.label}>Forwarded message</p>
      <p className={styles.chatbox}>
        {chatbox?.name ?? getMessageSenderLabel(source)}
      </p>
      <p className={styles.preview}>
        <AdEmojiText text={getMessagePreviewText(source)} />
      </p>
    </button>
  );
};

export default ForwardCard;

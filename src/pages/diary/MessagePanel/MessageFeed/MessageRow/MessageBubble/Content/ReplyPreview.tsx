import type { FC } from 'react';

import { useDiaryStore } from '@/store';

import {
  getMessagePreviewText,
  getMessageSenderLabel,
} from '../../../../messagePanel.utils';
import styles from './ReplyPreview.module.css';

export type ReplyPreviewProps = {
  replyToMessageId: string;
  onJump?: (messageId: string) => void;
};

const ReplyPreview: FC<ReplyPreviewProps> = ({ replyToMessageId, onJump }) => {
  const messages = useDiaryStore('messages');
  const target = messages[replyToMessageId];
  const unavailable = !target;

  return (
    <button
      type="button"
      className={styles.root}
      disabled={unavailable || !onJump}
      onClick={() => onJump?.(replyToMessageId)}
    >
      {unavailable ? (
        <p className={styles.unavailable}>Message unavailable</p>
      ) : (
        <>
          <p className={styles.sender}>{getMessageSenderLabel(target)}</p>
          <p className={styles.preview}>{getMessagePreviewText(target)}</p>
        </>
      )}
    </button>
  );
};

export default ReplyPreview;

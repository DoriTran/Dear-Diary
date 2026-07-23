import type { FC } from 'react';

import { faReply } from '@fortawesome/free-solid-svg-icons';

import { AdEmojiText, AdIcon } from '@/packages/base';
import { useDiaryStore } from '@/store';

import {
  getMessagePreviewText,
  truncateReplyPreviewText,
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
  const previewText = unavailable
    ? 'Message unavailable'
    : truncateReplyPreviewText(getMessagePreviewText(target));

  return (
    <button
      type="button"
      className={styles.root}
      disabled={unavailable || !onJump}
      onClick={() => onJump?.(replyToMessageId)}
    >
      <span className={styles.icon} aria-hidden>
        <AdIcon icon={faReply} size={12} />
      </span>
      <span className={styles.label}>
        {unavailable ? (
          previewText
        ) : (
          <>
            Replying to{' '}
            <span className={styles.quote}>
              "<AdEmojiText text={previewText} />"
            </span>
          </>
        )}
      </span>
    </button>
  );
};

export default ReplyPreview;

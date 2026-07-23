import { faReply, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import { AdEmojiText, AdIcon } from '@/packages/base';
import { useDiaryStore } from '@/store';

import {
  getMessagePreviewText,
  truncateReplyPreviewText,
} from '../../messagePanel.utils';
import styles from './ReplyPreviewInput.module.css';

export type ReplyPreviewInputProps = {
  replyToMessageId: string;
  onCancel: () => void;
  onJump: (messageId: string) => void;
};

const ReplyPreviewInput: FC<ReplyPreviewInputProps> = ({
  replyToMessageId,
  onCancel,
  onJump,
}) => {
  const messages = useDiaryStore('messages');
  const target = messages[replyToMessageId];
  const unavailable = !target;
  const previewText = unavailable
    ? 'Message unavailable'
    : truncateReplyPreviewText(getMessagePreviewText(target));

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.preview}
        disabled={unavailable}
        onClick={() => onJump(replyToMessageId)}
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

      <button
        type="button"
        className={styles.cancel}
        aria-label="Cancel reply"
        onClick={onCancel}
      >
        <AdIcon icon={faXmark} size={10} />
        Cancel
      </button>
    </div>
  );
};

export default ReplyPreviewInput;

import type { FC } from 'react';

import ReplyPreview from '../MessageFeed/messageRender/ReplyPreview';
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
  return (
    <div className={styles.root}>
      <div className={styles.preview}>
        <ReplyPreview
          replyToMessageId={replyToMessageId}
          variant="composer"
          onJump={onJump}
        />
      </div>
      <button
        type="button"
        className={styles.dismiss}
        aria-label="Cancel reply"
        onClick={onCancel}
      >
        ×
      </button>
    </div>
  );
};

export default ReplyPreviewInput;

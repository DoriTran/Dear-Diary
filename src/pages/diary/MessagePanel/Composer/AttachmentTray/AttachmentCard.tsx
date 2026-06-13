import type { FC } from 'react';

import { faFile, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';

import type { Attachment } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import { formatFileSize } from '../composer.utils';
import styles from './AttachmentTray.module.css';

export type AttachmentCardProps = {
  attachment: Attachment;
  compact?: boolean;
  onRemove?: () => void;
};

const AttachmentCard: FC<AttachmentCardProps> = ({
  attachment,
  compact = false,
  onRemove,
}) => {
  const name = attachment.name ?? attachment.url.split('/').pop() ?? 'file';
  const size =
    attachment.type === 'file' ? formatFileSize(attachment.size) : '';

  return (
    <div className={`${styles.card} ${compact ? styles.cardCompact : ''}`}>
      <div className={`${styles.thumb} ${compact ? styles.thumbCompact : ''}`}>
        {attachment.type === 'image' ? (
          <img src={attachment.url} alt="" className={styles.thumbImage} />
        ) : attachment.type === 'video' ? (
          <AdIcon icon={faPlay} size={compact ? 10 : 12} />
        ) : (
          <AdIcon icon={faFile} size={compact ? 10 : 12} />
        )}
      </div>
      <div className={styles.meta}>
        <span className={styles.name}>{name}</span>
        {size ? <span className={styles.size}>{size}</span> : null}
      </div>
      {onRemove ? (
        <button
          type="button"
          className={styles.removeBtn}
          aria-label={`Remove ${name}`}
          onClick={onRemove}
        >
          <AdIcon icon={faXmark} size={8} />
        </button>
      ) : null}
    </div>
  );
};

export default AttachmentCard;

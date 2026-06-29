import type { FC } from 'react';

import { faFile, faXmark } from '@fortawesome/free-solid-svg-icons';

import type { Attachment } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';
import { resolveAttachmentUrl } from '@/api';

import { formatFileSize } from '../composer.utils';
import styles from './AttachmentTray.module.css';
import VideoAttachment from './VideoAttachment';

export type AttachmentCardProps = {
  attachment: Attachment;
  compact?: boolean;
  variant?: 'default' | 'tray';
  onRemove?: () => void;
};

const AttachmentCard: FC<AttachmentCardProps> = ({
  attachment,
  compact = false,
  variant = 'default',
  onRemove,
}) => {
  const name = attachment.name ?? attachment.url.split('/').pop() ?? 'file';
  const size =
    attachment.type === 'file' ? formatFileSize(attachment.size) : '';
  const isMedia =
    attachment.type === 'image' || attachment.type === 'video';

  if (variant === 'tray' && isMedia) {
    return (
      <div className={styles.trayMediaCard}>
        <div className={styles.trayMediaThumb}>
          {attachment.type === 'image' ? (
            <img
              src={resolveAttachmentUrl(attachment.url, 'image')}
              alt=""
              className={styles.thumbImage}
            />
          ) : (
            <VideoAttachment attachment={attachment} variant="thumb" />
          )}
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
  }

  if (variant === 'tray' && attachment.type === 'file') {
    return (
      <div className={styles.trayFileCard}>
        <div className={styles.trayFileIcon}>
          <AdIcon icon={faFile} size={14} />
        </div>
        <span className={styles.trayFileName}>{name}</span>
        {size ? <span className={styles.trayFileSize}>{size}</span> : null}
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
  }

  return (
    <div className={`${styles.card} ${compact ? styles.cardCompact : ''}`}>
      <div className={`${styles.thumb} ${compact ? styles.thumbCompact : ''}`}>
        {attachment.type === 'image' ? (
          <img
            src={resolveAttachmentUrl(attachment.url, 'image')}
            alt=""
            className={styles.thumbImage}
          />
        ) : attachment.type === 'video' ? (
          <VideoAttachment attachment={attachment} variant="thumb" />
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

import type { FC } from 'react';

import { faFile, faPlay } from '@fortawesome/free-solid-svg-icons';

import type { Attachment } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import AttachmentCard from '../../Composer/AttachmentTray/AttachmentCard';
import styles from './AttachmentList.module.css';

export type AttachmentListProps = {
  attachments: Attachment[];
  compact?: boolean;
};

const AttachmentList: FC<AttachmentListProps> = ({
  attachments,
  compact = false,
}) => {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className={styles.attachmentList}>
      {attachments.map((attachment) => {
        if (attachment.type === 'link') {
          return null;
        }

        if (compact) {
          return (
            <AttachmentCard
              key={attachment.id}
              attachment={attachment}
              compact
            />
          );
        }

        if (attachment.type === 'image') {
          return (
            <a
              key={attachment.id}
              href={attachment.url}
              className={styles.imageLink}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={attachment.url}
                alt={attachment.name ?? 'Image attachment'}
                className={styles.image}
              />
            </a>
          );
        }

        if (attachment.type === 'video') {
          return (
            <div key={attachment.id} className={styles.videoCard}>
              <AdIcon icon={faPlay} size={12} />
              <span>{attachment.name ?? 'Video'}</span>
            </div>
          );
        }

        return (
          <a
            key={attachment.id}
            href={attachment.url}
            className={styles.fileCard}
            target="_blank"
            rel="noreferrer"
          >
            <AdIcon icon={faFile} size={12} />
            <span>{attachment.name ?? 'File'}</span>
          </a>
        );
      })}
    </div>
  );
};

export default AttachmentList;

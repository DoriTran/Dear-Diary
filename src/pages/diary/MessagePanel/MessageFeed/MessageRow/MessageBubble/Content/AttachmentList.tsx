import type { FC } from 'react';

import { faFile } from '@fortawesome/free-solid-svg-icons';

import type { Attachment } from '@/store/diary/type';

import { resolveAttachmentUrl } from '@/api';
import { AdIcon } from '@/packages/base';

import { attachment as composerAttachment } from '../../../../DiaryInput';
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
            <composerAttachment.AttachmentCard
              key={attachment.id}
              attachment={attachment}
              compact
            />
          );
        }

        if (attachment.type === 'image') {
          const imageUrl = resolveAttachmentUrl(attachment.url, 'image');

          return (
            <a
              key={attachment.id}
              href={imageUrl}
              className={styles.imageLink}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={imageUrl}
                alt={attachment.name ?? 'Image attachment'}
                className={styles.image}
              />
            </a>
          );
        }

        if (attachment.type === 'video') {
          return (
            <composerAttachment.VideoAttachment
              key={attachment.id}
              attachment={attachment}
              variant="player"
            />
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

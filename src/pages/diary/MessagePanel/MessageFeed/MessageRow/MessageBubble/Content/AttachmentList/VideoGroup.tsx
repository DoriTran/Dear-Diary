import type { FC } from 'react';

import clsx from 'clsx';

import type { VideoAttachment } from '@/store/diary/type';

import type { AttachmentListAlign } from './AttachmentList';

import { attachment as composerAttachment } from '../../../../../DiaryInput';
import styles from './VideoGroup.module.css';

export type VideoGroupProps = {
  attachments: VideoAttachment[];
  align?: AttachmentListAlign;
};

const VideoGroup: FC<VideoGroupProps> = ({ attachments, align = 'end' }) => {
  const isSolo = attachments.length === 1;

  return (
    <div
      className={clsx(
        styles.rows,
        isSolo && styles.rowsSolo,
        !isSolo && align === 'end' && styles.justifyEnd,
      )}
    >
      {attachments.map((video) => (
        <div key={video.id} className={styles.cell}>
          <composerAttachment.VideoAttachment
            attachment={video}
            variant="player"
          />
        </div>
      ))}
    </div>
  );
};

export default VideoGroup;

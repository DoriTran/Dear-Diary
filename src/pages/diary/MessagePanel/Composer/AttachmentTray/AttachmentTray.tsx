import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRef, type FC } from 'react';

import type { Attachment } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import AttachmentCard from './AttachmentCard';
import styles from './AttachmentTray.module.css';

export type AttachmentTrayProps = {
  attachments: Attachment[];
  focused: boolean;
  onRemove: (attachmentId: string) => void;
  onAddFiles: (
    files: FileList | File[],
    kind: 'file' | 'image' | 'video',
  ) => void;
};

const AttachmentTray: FC<AttachmentTrayProps> = ({
  attachments,
  focused,
  onRemove,
  onAddFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.trayAnchor} ${focused ? '' : styles.trayDimmed}`}
      aria-label="Attachments"
    >
      <div className={styles.tray}>
        {attachments.map((attachment) => (
          <AttachmentCard
            key={attachment.id}
            attachment={attachment}
            variant="tray"
            onRemove={() => onRemove(attachment.id)}
          />
        ))}
        <button
          type="button"
          className={styles.addBtn}
          aria-label="Add attachment"
          onClick={() => fileInputRef.current?.click()}
        >
          <AdIcon icon={faPlus} size={14} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className={styles.hiddenInput}
          multiple
          onChange={(event) => {
            if (event.target.files?.length) {
              onAddFiles(event.target.files, 'file');
              event.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default AttachmentTray;

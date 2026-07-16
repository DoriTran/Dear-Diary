import type { FC } from 'react';

import clsx from 'clsx';

import type { ImageAttachment } from '@/store/diary/type';

import { resolveAttachmentUrl } from '@/api';

import styles from './ImageGroup.module.css';
import { buildAttachmentRows } from './imageLayout.utils';

export type ImageGroupProps = {
  attachments: ImageAttachment[];
};

const LARGE_CAPACITY = 3;
const SMALL_CAPACITY = 4;

const ImageGroup: FC<ImageGroupProps> = ({ attachments }) => {
  const rows = buildAttachmentRows(attachments, LARGE_CAPACITY, SMALL_CAPACITY);
  // The layout solver only ever leaves a single item alone in a row when the
  // whole group has exactly 1 image (3 and 4 are coprime, so every other
  // count either fills its row or leaves at least 2 in the last one).
  const isSolo = attachments.length === 1;

  return (
    <div className={clsx(styles.rows, isSolo && styles.rowsSolo)}>
      {rows.map((row) => (
        <div
          key={row.map((image) => image.id).join(':')}
          className={styles.row}
        >
          {row.map((image) => {
            const imageUrl = resolveAttachmentUrl(image.url, 'image');

            return (
              <a
                key={image.id}
                href={imageUrl}
                className={clsx(styles.cell, isSolo && styles.cellSolo)}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={imageUrl}
                  alt={image.name ?? 'Image attachment'}
                  className={styles.image}
                />
              </a>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ImageGroup;

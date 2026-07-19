import type { FC, MouseEvent } from 'react';

import clsx from 'clsx';
import { useState } from 'react';

import type { ImageAttachment } from '@/store/diary/type';

import { resolveAttachmentUrl } from '@/api';

import styles from './ImageGroup.module.css';
import { buildAttachmentRows } from './imageLayout.utils';
import ImageLightbox from './ImageLightbox';

export type ImageGroupProps = {
  attachments: ImageAttachment[];
};

const LARGE_CAPACITY = 3;
const SMALL_CAPACITY = 4;

const ImageGroup: FC<ImageGroupProps> = ({ attachments }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rows = buildAttachmentRows(attachments, LARGE_CAPACITY, SMALL_CAPACITY);
  // The layout solver only ever leaves a single item alone in a row when the
  // whole group has exactly 1 image (3 and 4 are coprime, so every other
  // count either fills its row or leaves at least 2 in the last one).
  const isSolo = attachments.length === 1;

  const handleOpen = (index: number) => (event: MouseEvent) => {
    event.preventDefault();
    setOpenIndex(index);
  };

  return (
    <div className={styles.rows}>
      {rows.map((row) => (
        <div
          key={row.map((image) => image.id).join(':')}
          className={styles.row}
        >
          {row.map((image) => {
            const imageUrl = resolveAttachmentUrl(image.url, 'image');
            const index = attachments.indexOf(image);

            return (
              <a
                key={image.id}
                href={imageUrl}
                className={clsx(
                  styles.cell,
                  isSolo && styles.cellSolo,
                  !isSolo &&
                    row.length >= SMALL_CAPACITY &&
                    styles.cellSmall,
                )}
                target="_blank"
                rel="noreferrer"
                onClick={handleOpen(index)}
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

      {openIndex !== null && (
        <ImageLightbox
          images={attachments}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
};

export default ImageGroup;

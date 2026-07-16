import type { CSSProperties, FC, MouseEvent, SyntheticEvent } from 'react';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import clsx from 'clsx';

import type { ImageAttachment } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import { resolveAttachmentUrl } from '@/api';

import styles from './ImageLightbox.module.css';

export type ImageLightboxProps = {
  images: ImageAttachment[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const downloadImage = async (url: string, name?: string): Promise<void> => {
  const filename = name?.trim() || 'image';

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    // Fallback: open the image in a new tab if the blob download fails
    // (e.g. a cross-origin host without CORS).
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

const aspectRatioFrom = (image: ImageAttachment): number | undefined => {
  if (image.width && image.height && image.height > 0) {
    return image.width / image.height;
  }

  return undefined;
};

const ImageLightbox: FC<ImageLightboxProps> = ({
  images,
  index,
  onIndexChange,
  onClose,
}) => {
  const total = images.length;
  const current = images[index];
  const currentUrl = current ? resolveAttachmentUrl(current.url, 'image') : '';

  const [aspectRatio, setAspectRatio] = useState<number | undefined>(() =>
    current ? aspectRatioFrom(current) : undefined,
  );

  useEffect(() => {
    setAspectRatio(current ? aspectRatioFrom(current) : undefined);
  }, [current]);

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;

    if (naturalWidth > 0 && naturalHeight > 0) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  const goPrev = useCallback(() => {
    if (index > 0) {
      onIndexChange(index - 1);
    }
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index < total - 1) {
      onIndexChange(index + 1);
    }
  }, [index, total, onIndexChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [goPrev, goNext, onClose]);

  if (!current) {
    return null;
  }

  const stop = (event: MouseEvent) => event.stopPropagation();

  const frameStyle = {
    '--ar': aspectRatio ?? 1.5,
  } as CSSProperties;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={styles.controls}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => void downloadImage(currentUrl, current.name)}
          aria-label="Download image"
        >
          <AdIcon icon="Download" source="lucide" size="1.125rem" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onClose}
          aria-label="Close"
        >
          <AdIcon icon="X" source="lucide" size="1.125rem" />
        </button>
      </div>

      <div className={styles.stage}>
        {hasPrev && (
          <button
            type="button"
            className={clsx(styles.iconButton, styles.arrow, styles.arrowPrev)}
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
          >
            <AdIcon icon="ChevronLeft" source="lucide" size="1.5rem" />
          </button>
        )}

        <figure className={styles.figure}>
          <div className={styles.frame} style={frameStyle} onClick={stop}>
            <img
              src={currentUrl}
              alt={current.name ?? 'Image attachment'}
              className={styles.image}
              onLoad={handleImageLoad}
            />
          </div>
        </figure>

        {hasNext && (
          <button
            type="button"
            className={clsx(styles.iconButton, styles.arrow, styles.arrowNext)}
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
          >
            <AdIcon icon="ChevronRight" source="lucide" size="1.5rem" />
          </button>
        )}
      </div>

      {total > 1 && (
        <>
          <div className={styles.thumbnails} onClick={stop}>
            {images.map((image, thumbIndex) => (
              <button
                key={image.id}
                type="button"
                className={clsx(
                  styles.thumb,
                  thumbIndex === index && styles.thumbActive,
                )}
                onClick={() => onIndexChange(thumbIndex)}
                aria-label={`View image ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
              >
                <img
                  src={resolveAttachmentUrl(image.url, 'image')}
                  alt={image.name ?? `Image ${thumbIndex + 1}`}
                  className={styles.thumbImage}
                />
              </button>
            ))}
          </div>
          <span className={styles.counter}>
            {index + 1} / {total}
          </span>
        </>
      )}
    </div>,
    document.body,
  );
};

export default ImageLightbox;

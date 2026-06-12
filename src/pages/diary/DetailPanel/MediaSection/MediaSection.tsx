import {
  faFile,
  faImage,
  faLink,
  faPlay,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useState, type FC } from 'react';

import { AdIcon } from '@/packages/base';

import type { DetailPanelData, MediaFilter } from '../../types';

import styles from './MediaSection.module.css';

export type MediaSectionProps = {
  data: DetailPanelData;
};

const FILTERS: { id: MediaFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'links', label: 'Links' },
  { id: 'files', label: 'Files' },
];

const MediaSection: FC<MediaSectionProps> = ({ data }) => {
  const [filter, setFilter] = useState<MediaFilter>('all');

  return (
    <section id="detail-media" className={styles.root}>
      <h3 className={styles.heading}>Media</h3>
      <div className={styles.filters}>
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.filterChip}
            data-active={filter === item.id || undefined}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {data.media.map((item) => {
          if (item.type === 'add') {
            return (
              <button
                key={item.id}
                type="button"
                className={clsx(styles.cell, styles.addCell)}
                aria-label="Add media"
              >
                <AdIcon icon={faPlus} size={16} />
              </button>
            );
          }
          if (item.type === 'file') {
            return (
              <div key={item.id} className={clsx(styles.cell, styles.fileCell)}>
                <AdIcon icon={faFile} size={18} />
                <span className={styles.fileLabel}>{item.label}</span>
              </div>
            );
          }
          return (
            <div
              key={item.id}
              className={styles.cell}
              style={
                item.thumbnail
                  ? { backgroundImage: `url(${item.thumbnail})` }
                  : undefined
              }
            >
              {item.type === 'video' ? (
                <>
                  <span className={styles.playOverlay} aria-hidden>
                    <AdIcon icon={faPlay} size={10} />
                  </span>
                  {item.duration ? (
                    <span className={styles.duration}>{item.duration}</span>
                  ) : null}
                </>
              ) : item.type === 'link' ? (
                <span className={styles.typeIcon} aria-hidden>
                  <AdIcon icon={faLink} size={12} />
                </span>
              ) : (
                <span className={styles.typeIcon} aria-hidden>
                  <AdIcon icon={faImage} size={12} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      {data.mediaTotal > 0 ? (
        <button type="button" className={styles.viewAll}>
          View all media ({data.mediaTotal})
        </button>
      ) : null}
    </section>
  );
};

export default MediaSection;

import type { FC } from 'react';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import { AdIcon } from '@/packages/base';

import type { DetailPanelData } from '../../types';

import styles from './TagsSection.module.css';

export type TagsSectionProps = {
  data: DetailPanelData;
};

const TagsSection: FC<TagsSectionProps> = ({ data }) => {
  return (
    <section id="detail-tags" className={styles.root}>
      <h3 className={styles.heading}>Tags</h3>
      <ul className={styles.list}>
        {data.tags.map((tag) => (
          <li key={tag.label}>
            <button type="button" className={styles.tagBtn}>
              <span
                className={clsx(
                  styles.tagLabel,
                  tag.tone && styles[`tag_${tag.tone}`],
                )}
              >
                {tag.label}
              </span>
              <span className={styles.count}>{tag.count}</span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.addBtn}>
        <AdIcon icon={faPlus} size={11} />
        Add tag
      </button>
    </section>
  );
};

export default TagsSection;

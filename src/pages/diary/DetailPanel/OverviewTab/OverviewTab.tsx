import {
  faComment,
  faFile,
  faImage,
  faPaperclip,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import { AdIcon } from '@/packages/base';

import type { DetailPanelStats, DetailPanelTag } from '../detailPanel.utils';
import InfoCallout from '../components/InfoCallout';
import ProgressBarRow from '../components/ProgressBarRow';
import StatCard from '../components/StatCard';

import styles from './OverviewTab.module.css';
import TagFill from './TagFill';

export type OverviewTabProps = {
  stats: DetailPanelStats;
  topTags: DetailPanelTag[];
  onPinnedClick: () => void;
  onArchivedClick: () => void;
  onTagClick: (tagId: string) => void;
};

const OverviewTab: FC<OverviewTabProps> = ({
  stats,
  topTags,
  onPinnedClick,
  onArchivedClick,
  onTagClick,
}) => {
  const maxTagCount = topTags[0]?.count ?? 1;

  return (
    <div className={styles.root}>
      <section className={styles.section}>
        <h3 className={styles.heading}>Statistics</h3>
        <div className={styles.statGrid}>
          <StatCard
            label="Messages"
            value={stats.totalMessages}
            icon={<AdIcon icon={faComment} size={12} />}
          />
          <StatCard
            label="Attachments"
            value={stats.totalAttachments}
            icon={<AdIcon icon={faPaperclip} size={12} />}
          />
          <StatCard
            label="Images"
            value={stats.imageCount}
            icon={<AdIcon icon={faImage} size={12} />}
          />
          <StatCard
            label="Videos"
            value={stats.videoCount}
            icon={<AdIcon icon={faVideo} size={12} />}
          />
          <StatCard
            label="Files"
            value={stats.fileCount}
            icon={<AdIcon icon={faFile} size={12} />}
          />
          <StatCard label="Last updated" value={stats.updatedLabel} />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Message Status</h3>
        <div className={styles.progressList}>
          <ProgressBarRow
            label="Pinned"
            count={stats.pinnedCount}
            total={stats.totalMessages}
            onClick={onPinnedClick}
          />
          <ProgressBarRow
            label="Archived"
            count={stats.archivedCount}
            total={stats.totalMessages}
            tone="blue"
            onClick={onArchivedClick}
          />
        </div>
        <InfoCallout>
          Click a bar to open the Category tab with that section expanded.
        </InfoCallout>
      </section>

      {topTags.length > 0 ? (
        <section className={styles.section}>
          <h3 className={styles.heading}>Top Tags</h3>
          <ul className={styles.tagList}>
            {topTags.map((tag) => {
              const percent = Math.round((tag.count / maxTagCount) * 100);

              return (
                <li key={tag.tagId}>
                  <button
                    type="button"
                    className={styles.tagRow}
                    onClick={() => onTagClick(tag.tagId)}
                  >
                    <span className={styles.tagLabel}>#{tag.label}</span>
                    <span className={styles.tagTrack} aria-hidden>
                      <TagFill colorId={tag.colorId} percent={percent} />
                    </span>
                    <span className={styles.tagCount}>{tag.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <InfoCallout>
            Click a tag to filter messages in the Category tab.
          </InfoCallout>
        </section>
      ) : null}
    </div>
  );
};

export default OverviewTab;

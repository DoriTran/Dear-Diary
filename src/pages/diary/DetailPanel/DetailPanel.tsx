import type { FC } from 'react';

import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';

import { diaryDetailPanels } from '../data';
import styles from './DetailPanel.module.css';
import Header from './Header/Header';
import MediaSection from './MediaSection/MediaSection';
import PinnedSection from './PinnedSection/PinnedSection';
import SummarySection from './SummarySection/SummarySection';
import Tabs from './Tabs/Tabs';
import TagsSection from './TagsSection/TagsSection';

export type DetailPanelProps = {
  chatboxId: string;
  collapsed: boolean;
};

const DetailPanel: FC<DetailPanelProps> = ({ chatboxId, collapsed }) => {
  const data = diaryDetailPanels[chatboxId];

  if (!data) {
    return null;
  }

  return (
    <LayoutCard
      tag="aside"
      className={styles.root}
      data-collapsed={collapsed || undefined}
      aria-label="Details and organization"
      aria-hidden={collapsed}
    >
      <Header />
      <Tabs />
      <div className={styles.scroll}>
        <MediaSection data={data} />
        <TagsSection data={data} />
        <SummarySection summary={data.summary} />
        <PinnedSection data={data} />
      </div>
    </LayoutCard>
  );
};

export default DetailPanel;

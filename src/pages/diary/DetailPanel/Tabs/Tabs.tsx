import { useState, type FC } from 'react';

import type { DetailPanelTab } from '../../types';

import styles from './Tabs.module.css';

const TAB_ITEMS: { id: DetailPanelTab; label: string; sectionId: string }[] = [
  { id: 'media', label: 'Media', sectionId: 'detail-media' },
  { id: 'tags', label: 'Tags', sectionId: 'detail-tags' },
  { id: 'pinned', label: 'Pinned', sectionId: 'detail-pinned' },
  { id: 'summary', label: 'Summary', sectionId: 'detail-summary' },
];

const Tabs: FC = () => {
  const [activeTab, setActiveTab] = useState<DetailPanelTab>('media');

  const handleTabClick = (tab: DetailPanelTab, sectionId: string) => {
    setActiveTab(tab);
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={styles.root} aria-label="Detail sections">
      {TAB_ITEMS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={styles.tab}
          data-active={activeTab === tab.id || undefined}
          onClick={() => handleTabClick(tab.id, tab.sectionId)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;

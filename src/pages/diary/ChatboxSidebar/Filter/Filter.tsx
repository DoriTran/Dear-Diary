import type { FC } from 'react';

import type { DiaryFilterTab } from '../../types';

import styles from './Filter.module.css';

const TABS: { id: DiaryFilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pinned', label: 'Pinned' },
  { id: 'recent', label: 'Recent' },
  { id: 'archived', label: 'Archived' },
];

export type FilterProps = {
  activeTab: DiaryFilterTab;
  onTabChange: (tab: DiaryFilterTab) => void;
};

const Filter: FC<FilterProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.root} role="tablist" aria-label="Filter chatboxes">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={styles.tab}
          type="button"
          role="tab"
          data-active={tab.id === activeTab || undefined}
          aria-selected={tab.id === activeTab}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Filter;

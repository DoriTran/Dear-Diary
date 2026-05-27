import type { FC } from 'react';

import type { DiaryFilterTab } from '../../types';

import styles from './Filter.module.css';

const TABS: { id: DiaryFilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pinned', label: 'Pinned' },
  { id: 'recent', label: 'Recent' },
  { id: 'archived', label: 'Archived' },
];

const Filter: FC = () => {
  return (
    <div className={styles.root} role="tablist" aria-label="Filter chatboxes">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={styles.tab}
          type="button"
          role="tab"
          data-active={tab.id === 'all' || undefined}
          aria-selected={tab.id === 'all'}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Filter;

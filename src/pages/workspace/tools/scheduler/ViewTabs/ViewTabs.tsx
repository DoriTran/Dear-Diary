import type { FC } from 'react';

import clsx from 'clsx';

import { SCHEDULER_VIEWS, type SchedulerView } from '../scheduler.utils';
import styles from './ViewTabs.module.css';

export type ViewTabsProps = {
  activeView: SchedulerView;
  onChange: (view: SchedulerView) => void;
};

const ViewTabs: FC<ViewTabsProps> = ({ activeView, onChange }) => {
  return (
    <div className={styles.root} role="tablist" aria-label="Calendar views">
      {SCHEDULER_VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          role="tab"
          aria-selected={activeView === view.id}
          className={clsx(styles.tab, activeView === view.id && styles.active)}
          onClick={() => onChange(view.id)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;

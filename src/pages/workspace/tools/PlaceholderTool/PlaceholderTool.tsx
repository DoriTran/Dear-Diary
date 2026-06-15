import type { FC } from 'react';

import { WORKSPACE_TYPE_LABELS } from '../../workspace.utils';
import type { WorkspaceToolRendererProps } from '../types';
import styles from './PlaceholderTool.module.css';

const PlaceholderTool: FC<WorkspaceToolRendererProps> = ({ workspace }) => {
  return (
    <div className={styles.root}>
      <span className={styles.icon} style={{ background: workspace.color }}>
        {workspace.icon}
      </span>
      <h2 className={styles.title}>
        {WORKSPACE_TYPE_LABELS[workspace.type]} Tool
      </h2>
      <p className={styles.description}>
        This workspace type renderer is coming soon. Select a Scheduler workspace
        to explore the full calendar experience.
      </p>
    </div>
  );
};

export default PlaceholderTool;

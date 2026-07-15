import type { FC } from 'react';

import { AdIcon } from '@/packages/base';
import { ColorMainSwatch } from '@/packages/color';
import { normalizeIconId } from '@/packages/icon';

import type { WorkspaceToolRendererProps } from '../types';

import { WORKSPACE_TYPE_LABELS } from '../../workspace.utils';
import styles from './PlaceholderTool.module.css';

const PlaceholderTool: FC<WorkspaceToolRendererProps> = ({ workspace }) => {
  return (
    <div className={styles.root}>
      <ColorMainSwatch className={styles.icon} colorId={workspace.colorId}>
        <AdIcon
          icon={normalizeIconId(workspace.icon)}
          source="lucide"
          size={28}
        />
      </ColorMainSwatch>
      <h2 className={styles.title}>
        {WORKSPACE_TYPE_LABELS[workspace.type]} Tool
      </h2>
      <p className={styles.description}>
        This workspace type renderer is coming soon. Select a Scheduler
        workspace to explore the full calendar experience.
      </p>
    </div>
  );
};

export default PlaceholderTool;

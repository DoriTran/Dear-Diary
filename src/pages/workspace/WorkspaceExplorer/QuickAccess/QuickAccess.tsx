import type { FC } from 'react';

import clsx from 'clsx';

import type { Workspace } from '@/store/workspace/type';

import styles from './QuickAccess.module.css';

export type QuickAccessProps = {
  workspaces: Workspace[];
  selectedWorkspaceId: string | null;
  onSelect: (workspaceId: string) => void;
};

const QuickAccess: FC<QuickAccessProps> = ({
  workspaces,
  selectedWorkspaceId,
  onSelect,
}) => {
  return (
    <section className={styles.root} aria-label="Quick access">
      <h2 className={styles.heading}>Quick Access</h2>
      <div className={styles.cards}>
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            type="button"
            className={clsx(
              styles.card,
              selectedWorkspaceId === workspace.id && styles.selected,
            )}
            onClick={() => onSelect(workspace.id)}
          >
            <span
              className={styles.icon}
              style={{ background: workspace.color }}
              aria-hidden
            >
              {workspace.icon}
            </span>
            <span className={styles.meta}>
              <span className={styles.name}>{workspace.name}</span>
              <span className={styles.type}>{workspace.type}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickAccess;

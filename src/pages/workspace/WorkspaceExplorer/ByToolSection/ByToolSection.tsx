import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useState, type FC } from 'react';

import type { Workspace, WorkspaceType } from '@/store/workspace/type';

import { AdIcon } from '@/packages/base';
import { ColorMainSwatch } from '@/packages/color';
import { normalizeIconId } from '@/packages/icon';

import styles from './ByToolSection.module.css';

export type ByToolSectionProps = {
  type: WorkspaceType;
  label: string;
  workspaces: Workspace[];
  selectedWorkspaceId: string | null;
  viewMode: 'grid' | 'list';
  onSelect: (workspaceId: string) => void;
  onCreate: (type: WorkspaceType) => void;
};

const ByToolSection: FC<ByToolSectionProps> = ({
  type,
  label,
  workspaces,
  selectedWorkspaceId,
  viewMode,
  onSelect,
  onCreate,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  if (workspaces.length === 0) {
    return null;
  }

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.headerToggle}
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
        >
          <span className={styles.headerLeft}>
            <span
              className={clsx(styles.chevron, collapsed && styles.collapsed)}
            >
              <AdIcon icon={faChevronDown} size={12} />
            </span>
            <span className={styles.label}>{label}</span>
            <span className={styles.count}>{workspaces.length}</span>
          </span>
        </button>
        <button
          type="button"
          className={styles.newButton}
          onClick={() => onCreate(type)}
        >
          <AdIcon icon={faPlus} size={11} />
          New
        </button>
      </div>

      {!collapsed ? (
        <div
          className={clsx(styles.cards, viewMode === 'list' && styles.listView)}
        >
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
              <ColorMainSwatch
                className={styles.icon}
                colorId={workspace.colorId}
                aria-hidden
              >
                <AdIcon
                  icon={normalizeIconId(workspace.icon)}
                  source="lucide"
                  size={18}
                />
              </ColorMainSwatch>
              <span className={styles.name}>{workspace.name}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default ByToolSection;

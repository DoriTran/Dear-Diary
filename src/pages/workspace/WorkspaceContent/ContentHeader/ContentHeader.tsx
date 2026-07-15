import type { FC } from 'react';

import {
  faBell,
  faEllipsisVertical,
  faFilter,
  faPen,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

import type { Chatbox } from '@/store/diary/type';
import type { Workspace, WorkspaceSource } from '@/store/workspace/type';

import { AdActionButton, AdIcon } from '@/packages/base';
import { ColorMainSwatch } from '@/packages/color';
import { normalizeIconId } from '@/packages/icon';

import {
  WORKSPACE_TYPE_LABELS,
  resolveSourceChipMeta,
} from '../../workspace.utils';
import styles from './ContentHeader.module.css';

export type ContentHeaderProps = {
  workspace: Workspace;
  sources: WorkspaceSource[];
  chatboxes: Record<string, Chatbox>;
};

const ContentHeader: FC<ContentHeaderProps> = ({
  workspace,
  sources,
  chatboxes,
}) => {
  return (
    <header className={styles.root}>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <ColorMainSwatch
            className={styles.icon}
            colorId={workspace.colorId}
            aria-hidden
          >
            <AdIcon
              icon={normalizeIconId(workspace.icon)}
              source="lucide"
              size={22}
            />
          </ColorMainSwatch>
          <div className={styles.copy}>
            <div className={styles.nameRow}>
              <h1 className={styles.title}>{workspace.name}</h1>
              <AdActionButton icon={faPen} label="Edit workspace" />
            </div>
            <span className={styles.badge}>
              {WORKSPACE_TYPE_LABELS[workspace.type]}
            </span>
            {workspace.description ? (
              <p className={styles.description}>{workspace.description}</p>
            ) : null}
          </div>
        </div>

        <div className={styles.actions}>
          <AdActionButton icon={faFilter} label="Filter" />
          <AdActionButton icon={faPen} label="Edit" />
          <AdActionButton icon={faEllipsisVertical} label="More options" />
          <AdActionButton icon={faBell} label="Notifications" />
        </div>
      </div>

      <div className={styles.sourcesBar}>
        {sources.map((source) => {
          const meta = resolveSourceChipMeta(source, chatboxes);

          return (
            <span
              key={source.id}
              className={styles.sourceChip}
              style={{
                background: `color-mix(in srgb, ${meta.color} 26%, var(--surface))`,
              }}
            >
              <span
                className={styles.sourceDot}
                style={{ background: meta.color }}
                aria-hidden
              />
              {meta.label}
            </span>
          );
        })}
        <span className={styles.addSource} aria-disabled="true">
          <AdActionButton icon={faPlus} label="Add source" tooltip={false} />
          Add Source
        </span>
      </div>
    </header>
  );
};

export default ContentHeader;

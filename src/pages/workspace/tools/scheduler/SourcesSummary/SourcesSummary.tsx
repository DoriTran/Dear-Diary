import type { FC } from 'react';

import type { WorkspaceSource } from '@/store/workspace/type';
import type { Chatbox } from '@/store/diary/type';

import {
  countRecordsBySource,
  resolveSourceChipMeta,
  WORKSPACE_LOCAL_SOURCE_COLOR,
} from '../../../workspace.utils';
import type { CalendarEventView } from '../scheduler.utils';
import styles from './SourcesSummary.module.css';

export type SourcesSummaryProps = {
  events: CalendarEventView[];
  sources: WorkspaceSource[];
  chatboxes: Record<string, Chatbox>;
};

const SourcesSummary: FC<SourcesSummaryProps> = ({
  events,
  sources,
  chatboxes,
}) => {
  const localCount = events.filter((event) => event.isLocal).length;
  const sourceCounts = countRecordsBySource(
    events.map((event) => event.record),
    sources,
  );

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>Sources</h3>
        <button type="button" className={styles.action} disabled>
          Manage Sources
        </button>
      </div>

      <ul className={styles.list}>
        {sourceCounts.map(({ source, count }) => {
          const meta = resolveSourceChipMeta(source, chatboxes);

          return (
            <li key={source.id} className={styles.item}>
              <span
                className={styles.dot}
                style={{ background: meta.color }}
                aria-hidden
              />
              <span>
                {meta.label}: {count} related events
              </span>
            </li>
          );
        })}
        <li className={styles.item}>
          <span
            className={styles.dot}
            style={{ background: WORKSPACE_LOCAL_SOURCE_COLOR }}
            aria-hidden
          />
          <span>Workspace Data: {localCount} related events</span>
        </li>
      </ul>
    </section>
  );
};

export default SourcesSummary;

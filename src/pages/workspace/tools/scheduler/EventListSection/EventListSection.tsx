import type { FC } from 'react';

import clsx from 'clsx';

import type { CalendarEventView } from '../scheduler.utils';
import { formatEventTimeRange } from '../scheduler.utils';
import styles from './EventListSection.module.css';

export type EventListSectionProps = {
  title: string;
  events: CalendarEventView[];
  selectedRecordId: string | null;
  onSelectRecord: (recordId: string) => void;
  actionLabel?: string;
  footerLabel?: string;
};

const EventListSection: FC<EventListSectionProps> = ({
  title,
  events,
  selectedRecordId,
  onSelectRecord,
  actionLabel,
  footerLabel,
}) => {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {actionLabel ? (
          <button type="button" className={styles.action} disabled>
            {actionLabel}
          </button>
        ) : null}
      </div>

      {events.length === 0 ? (
        <p className={styles.empty}>No events in this range.</p>
      ) : (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.record.id}>
              <button
                type="button"
                className={clsx(
                  styles.item,
                  selectedRecordId === event.record.id && styles.selected,
                )}
                onClick={() => onSelectRecord(event.record.id)}
              >
                <span
                  className={styles.dot}
                  style={{ background: event.sourceColor }}
                  aria-hidden
                />
                <span className={styles.copy}>
                  <span className={styles.eventTitle}>
                    {event.payload.title}
                  </span>
                  <span className={styles.meta}>
                    {formatEventTimeRange(event.payload)} · {event.sourceLabel}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {footerLabel ? (
        <button type="button" className={styles.footerLink} disabled>
          {footerLabel}
        </button>
      ) : null}
    </section>
  );
};

export default EventListSection;

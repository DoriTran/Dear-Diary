import type { FC } from 'react';

import clsx from 'clsx';
import moment from 'moment';

import type { CalendarEventView } from '../scheduler.utils';

import {
  getEventsForDay,
  getMonthGridDays,
  getMultiDayBarsForWeek,
  WEEKDAY_LABELS,
} from '../scheduler.utils';
import styles from './MonthCalendar.module.css';

export type MonthCalendarProps = {
  currentMonth: moment.Moment;
  events: CalendarEventView[];
  selectedRecordId: string | null;
  onSelectRecord: (recordId: string) => void;
  onMonthChange: (month: moment.Moment) => void;
};

const MonthCalendar: FC<MonthCalendarProps> = ({
  currentMonth,
  events,
  selectedRecordId,
  onSelectRecord,
  onMonthChange,
}) => {
  const days = getMonthGridDays(currentMonth);
  const weeks: moment.Moment[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <div className={styles.monthLabel}>
          {currentMonth.format('MMMM YYYY')}
        </div>
        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() =>
              onMonthChange(currentMonth.clone().subtract(1, 'month'))
            }
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.todayButton}
            onClick={() => onMonthChange(moment())}
          >
            Today
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => onMonthChange(currentMonth.clone().add(1, 'month'))}
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={styles.weekday}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.weeks}>
        {weeks.map((week, weekIndex) => {
          const bars = getMultiDayBarsForWeek(events, week[0]);

          return (
            <div key={weekIndex} className={styles.weekRow}>
              <div className={styles.barLayer}>
                {bars.map((bar) => (
                  <button
                    key={`${bar.recordId}-${bar.startCol}`}
                    type="button"
                    className={clsx(
                      styles.bar,
                      selectedRecordId === bar.recordId && styles.selected,
                    )}
                    style={{
                      gridColumn: `${bar.startCol + 1} / span ${bar.span}`,
                      background: bar.color,
                    }}
                    onClick={() => onSelectRecord(bar.recordId)}
                  >
                    {bar.title}
                  </button>
                ))}
              </div>

              {week.map((day) => {
                const dayEvents = getEventsForDay(events, day).filter(
                  (event) => !event.isLocal,
                );
                const isCurrentMonth = day.isSame(currentMonth, 'month');
                const isToday = day.isSame(moment(), 'day');

                return (
                  <div
                    key={day.format('YYYY-MM-DD')}
                    className={clsx(
                      styles.dayCell,
                      !isCurrentMonth && styles.outsideMonth,
                      isToday && styles.today,
                    )}
                  >
                    <span className={styles.dayNumber}>{day.format('D')}</span>
                    <div className={styles.events}>
                      {dayEvents.map((event) => (
                        <button
                          key={event.record.id}
                          type="button"
                          className={clsx(
                            styles.event,
                            selectedRecordId === event.record.id &&
                              styles.selected,
                          )}
                          onClick={() => onSelectRecord(event.record.id)}
                        >
                          <span
                            className={styles.eventDot}
                            style={{ background: event.sourceColor }}
                            aria-hidden
                          />
                          <span className={styles.eventTitle}>
                            {event.payload.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;

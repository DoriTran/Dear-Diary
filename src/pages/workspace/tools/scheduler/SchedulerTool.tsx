import { useMemo, useState, type FC } from 'react';

import moment from 'moment';

import { useDiaryStore } from '@/store';

import type { WorkspaceToolRendererProps } from '../types';
import EventListSection from './EventListSection/EventListSection';
import MonthCalendar from './MonthCalendar/MonthCalendar';
import SourceLegend from './SourceLegend/SourceLegend';
import SourcesSummary from './SourcesSummary/SourcesSummary';
import {
  buildCalendarEventViews,
  getLegendItems,
  getTodayEvents,
  getUpcomingEvents,
  type SchedulerView,
} from './scheduler.utils';
import styles from './SchedulerTool.module.css';
import ViewTabs from './ViewTabs/ViewTabs';

const SchedulerTool: FC<WorkspaceToolRendererProps> = ({
  sources,
  records,
  selectedRecordId,
  onSelectRecord,
}) => {
  const chatboxes = useDiaryStore('chatboxes');
  const [activeView, setActiveView] = useState<SchedulerView>('month');
  const [currentMonth, setCurrentMonth] = useState(() => moment('2026-05-01'));

  const events = useMemo(
    () => buildCalendarEventViews(records, sources, chatboxes),
    [records, sources, chatboxes],
  );

  const legendItems = useMemo(
    () => getLegendItems(sources, chatboxes),
    [sources, chatboxes],
  );

  const todayEvents = useMemo(() => getTodayEvents(events), [events]);
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(events, moment().startOf('day'), 7),
    [events],
  );

  return (
    <div className={styles.root}>
      <ViewTabs activeView={activeView} onChange={setActiveView} />

      {activeView === 'month' ? (
        <>
          <div className={styles.calendarArea}>
            <MonthCalendar
              currentMonth={currentMonth}
              events={events}
              selectedRecordId={selectedRecordId}
              onSelectRecord={onSelectRecord}
              onMonthChange={setCurrentMonth}
            />
            <SourceLegend items={legendItems} />
          </div>

          <div className={styles.summaryGrid}>
            <EventListSection
              title="Today"
              events={todayEvents}
              selectedRecordId={selectedRecordId}
              onSelectRecord={onSelectRecord}
              actionLabel="+ Add Event"
            />
            <EventListSection
              title="Upcoming"
              events={upcomingEvents}
              selectedRecordId={selectedRecordId}
              onSelectRecord={onSelectRecord}
              footerLabel="View full agenda"
            />
            <SourcesSummary
              events={events}
              sources={sources}
              chatboxes={chatboxes}
            />
          </div>
        </>
      ) : (
        <div className={styles.stubView}>
          <p>The {activeView} view is coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default SchedulerTool;

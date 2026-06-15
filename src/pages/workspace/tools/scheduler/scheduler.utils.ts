import moment from 'moment';

import type { Chatbox } from '@/store/diary/type';
import type {
  SchedulerEventPayload,
  WorkspaceRecord,
  WorkspaceSource,
} from '@/store/workspace/type';

import {
  getSchedulerPayload,
  resolveRecordSourceMeta,
  WORKSPACE_LOCAL_SOURCE_COLOR,
  WORKSPACE_LOCAL_SOURCE_LABEL,
} from '../../workspace.utils';

export type SchedulerView = 'day' | 'week' | 'month' | 'timeline' | 'agenda';

export type CalendarEventView = {
  record: WorkspaceRecord;
  payload: SchedulerEventPayload;
  sourceLabel: string;
  sourceColor: string;
  isLocal: boolean;
};

export type CalendarBarSegment = {
  recordId: string;
  title: string;
  color: string;
  startCol: number;
  span: number;
  rowIndex: number;
};

export const SCHEDULER_VIEWS: { id: SchedulerView; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'agenda', label: 'Agenda' },
];

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const buildCalendarEventViews = (
  records: WorkspaceRecord[],
  sources: WorkspaceSource[],
  chatboxes: Record<string, Chatbox>,
): CalendarEventView[] => {
  return records
    .map((record) => {
      const payload = getSchedulerPayload(record);

      if (!payload) {
        return null;
      }

      const meta = resolveRecordSourceMeta(record.source, sources, chatboxes);

      return {
        record,
        payload,
        sourceLabel: meta.label,
        sourceColor: meta.color,
        isLocal: record.source.type === 'local',
      };
    })
    .filter((item): item is CalendarEventView => Boolean(item));
};

export const getMonthGridDays = (currentMonth: moment.Moment) => {
  const start = currentMonth.clone().startOf('month').startOf('week');
  const end = currentMonth.clone().endOf('month').endOf('week');
  const days: moment.Moment[] = [];

  const cursor = start.clone();

  while (cursor.isSameOrBefore(end, 'day')) {
    days.push(cursor.clone());
    cursor.add(1, 'day');
  }

  return days;
};

export const getEventsForDay = (
  events: CalendarEventView[],
  day: moment.Moment,
) => {
  return events.filter((event) => {
    const start = moment(event.payload.startDate).startOf('day');
    const end = moment(event.payload.endDate).startOf('day');

    return day.isSameOrAfter(start, 'day') && day.isSameOrBefore(end, 'day');
  });
};

export const getMultiDayBarsForWeek = (
  events: CalendarEventView[],
  weekStart: moment.Moment,
): CalendarBarSegment[] => {
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    weekStart.clone().add(index, 'day'),
  );

  const bars: CalendarBarSegment[] = [];

  events
    .filter((event) => event.isLocal)
    .forEach((event) => {
      const start = moment(event.payload.startDate).startOf('day');
      const end = moment(event.payload.endDate).startOf('day');

      weekDays.forEach((day, colIndex) => {
        if (!day.isSameOrAfter(start, 'day') || !day.isSameOrBefore(end, 'day')) {
          return;
        }

        let span = 1;

        for (let next = colIndex + 1; next < 7; next += 1) {
          const nextDay = weekDays[next];

          if (
            nextDay.isSameOrAfter(start, 'day') &&
            nextDay.isSameOrBefore(end, 'day')
          ) {
            span += 1;
          } else {
            break;
          }
        }

        const isSegmentStart =
          colIndex === 0 || !weekDays[colIndex - 1].isBetween(start, end, 'day', '[]');

        if (!isSegmentStart) {
          return;
        }

        bars.push({
          recordId: event.record.id,
          title: event.payload.title,
          color: event.sourceColor,
          startCol: colIndex,
          span: Math.min(span, 7 - colIndex),
          rowIndex: 0,
        });
      });
    });

  return bars;
};

export const formatEventTimeRange = (payload: SchedulerEventPayload) => {
  if (payload.allDay) {
    return 'All day';
  }

  const start = moment(payload.startDate);
  const end = moment(payload.endDate);

  return `${start.format('h:mm A')} – ${end.format('h:mm A')}`;
};

export const formatEventDate = (payload: SchedulerEventPayload) => {
  const start = moment(payload.startDate);
  const end = moment(payload.endDate);

  if (start.isSame(end, 'day')) {
    return start.format('MMM D, YYYY');
  }

  return `${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`;
};

export const getLegendItems = (
  sources: WorkspaceSource[],
  chatboxes: Record<string, Chatbox>,
) => {
  const sourceItems = sources.map((source) => {
    if (source.type === 'chatbox') {
      const chatbox = chatboxes[source.chatboxId];

      return {
        label: source.label,
        color: chatbox?.color ?? '#94A3B8',
      };
    }

    return {
      label: source.label,
      color: '#94A3B8',
    };
  });

  return [
    ...sourceItems,
    {
      label: WORKSPACE_LOCAL_SOURCE_LABEL,
      color: WORKSPACE_LOCAL_SOURCE_COLOR,
    },
  ];
};

export const getTodayEvents = (
  events: CalendarEventView[],
  today = moment(),
) => {
  const dayStart = today.clone().startOf('day');

  return events
    .filter((event) => {
      const start = moment(event.payload.startDate).startOf('day');
      const end = moment(event.payload.endDate).startOf('day');

      return dayStart.isSameOrAfter(start, 'day') && dayStart.isSameOrBefore(end, 'day');
    })
    .sort(
      (left, right) =>
        moment(left.payload.startDate).valueOf() -
        moment(right.payload.startDate).valueOf(),
    );
};

export const getUpcomingEvents = (
  events: CalendarEventView[],
  fromDate: moment.Moment,
  days = 7,
) => {
  const start = fromDate.clone().startOf('day').add(1, 'day');
  const end = fromDate.clone().startOf('day').add(days, 'day').endOf('day');

  return events
    .filter((event) => {
      const eventStart = moment(event.payload.startDate);

      return eventStart.isSameOrAfter(start, 'day') && eventStart.isSameOrBefore(end, 'day');
    })
    .sort(
      (left, right) =>
        moment(left.payload.startDate).valueOf() -
        moment(right.payload.startDate).valueOf(),
    );
};

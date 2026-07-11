const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const SECOND_MS = 1000;

export const MAX_MINUTES_PER_DAY = 24 * 60 - 1;

export type DurationEditMode = {
  disableDay?: boolean;
  disableHour?: boolean;
};

export type DurationEditParts = {
  days?: number;
  time?: string;
  minutes?: number;
  seconds?: number;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

const formatTime = (hours: number, minutes: number, seconds: number) =>
  `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;

const formatDurationTime = (hours: number, minutes: number, seconds: number) =>
  `${hours}:${pad2(minutes)}:${pad2(seconds)}`;

export const durationMsToEditParts = (
  ms: number,
  mode: DurationEditMode = {},
): DurationEditParts => {
  const safeMs = Math.max(0, ms);
  const { disableDay = false, disableHour = false } = mode;

  if (disableHour) {
    const seconds = Math.floor((safeMs % MINUTE_MS) / SECOND_MS);

    if (disableDay) {
      return {
        minutes: Math.floor(safeMs / MINUTE_MS),
        seconds,
      };
    }

    const days = Math.floor(safeMs / DAY_MS);
    const remainder = safeMs % DAY_MS;
    const minutes = Math.min(
      MAX_MINUTES_PER_DAY,
      Math.floor(remainder / MINUTE_MS),
    );

    return { days, minutes, seconds };
  }

  if (disableDay) {
    const totalHours = Math.floor(safeMs / HOUR_MS);
    const remainder = safeMs % HOUR_MS;
    const minutes = Math.floor(remainder / MINUTE_MS);
    const seconds = Math.floor((remainder % MINUTE_MS) / SECOND_MS);

    return {
      time: formatDurationTime(totalHours, minutes, seconds),
    };
  }

  const totalSeconds = Math.floor(safeMs / SECOND_MS);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const remainder = totalSeconds % (24 * 60 * 60);
  const hours = Math.floor(remainder / 3600);
  const minutes = Math.floor((remainder % 3600) / 60);
  const seconds = remainder % 60;

  return {
    days,
    time: formatTime(hours, minutes, seconds),
  };
};

export const editPartsToDurationMs = (
  parts: DurationEditParts,
  mode: DurationEditMode = {},
): number => {
  const { disableDay = false, disableHour = false } = mode;

  if (disableHour) {
    const minutes = Math.max(0, parts.minutes ?? 0);
    const seconds = Math.min(59, Math.max(0, parts.seconds ?? 0));

    if (disableDay) {
      return minutes * MINUTE_MS + seconds * SECOND_MS;
    }

    const days = Math.max(0, parts.days ?? 0);
    const clampedMinutes = Math.min(MAX_MINUTES_PER_DAY, minutes);

    return days * DAY_MS + clampedMinutes * MINUTE_MS + seconds * SECOND_MS;
  }

  if (disableDay) {
    const segments = (parts.time ?? '0:00:00')
      .split(':')
      .map((part) => Number(part) || 0);
    const hours = segments[0] ?? 0;
    const minutes = Math.min(59, segments[1] ?? 0);
    const seconds = Math.min(59, segments[2] ?? 0);

    return hours * HOUR_MS + minutes * MINUTE_MS + seconds * SECOND_MS;
  }

  const segments = (parts.time ?? '00:00:00')
    .split(':')
    .map((part) => Number(part) || 0);
  const days = Math.max(0, parts.days ?? 0);
  const hours = Math.min(23, segments[0] ?? 0);
  const minutes = Math.min(59, segments[1] ?? 0);
  const seconds = Math.min(59, segments[2] ?? 0);

  return (
    days * DAY_MS + hours * HOUR_MS + minutes * MINUTE_MS + seconds * SECOND_MS
  );
};

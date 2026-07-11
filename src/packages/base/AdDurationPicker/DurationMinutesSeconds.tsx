import type { FC } from 'react';

import clsx from 'clsx';

import styles from './AdDurationPicker.module.css';
import { MAX_MINUTES_PER_DAY } from './durationEdit.utils';

export type DurationMinutesSecondsProps = {
  minutes: number;
  seconds: number;
  onChange: (next: { minutes: number; seconds: number }) => void;
  disabled?: boolean;
  compact?: boolean;
  maxMinutes?: number;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const DurationMinutesSeconds: FC<DurationMinutesSecondsProps> = ({
  minutes,
  seconds,
  onChange,
  disabled = false,
  compact = false,
  maxMinutes = MAX_MINUTES_PER_DAY,
}) => {
  const minuteDigits = Math.max(2, String(minutes).length);
  const minuteMax = maxMinutes ?? Number.MAX_SAFE_INTEGER;

  return (
    <div className={clsx(styles.fieldsGroup, compact && styles.compactGroup)}>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        aria-label="Minutes"
        className={clsx(styles.field, styles.minutesField)}
        style={{ width: `calc(${minuteDigits}ch + 0.3em)` }}
        value={minutes}
        onChange={(event) => {
          const nextMinutes = clamp(
            Number(event.target.value.replace(/\D/g, '')) || 0,
            0,
            minuteMax,
          );
          onChange({ minutes: nextMinutes, seconds });
        }}
        onBlur={() => {
          onChange({
            minutes: clamp(minutes, 0, minuteMax),
            seconds: clamp(seconds, 0, 59),
          });
        }}
      />
      <span className={styles.separator}>:</span>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        aria-label="Seconds"
        className={styles.field}
        value={pad2(seconds)}
        onChange={(event) => {
          const raw = event.target.value.replace(/\D/g, '').slice(0, 2);
          const nextSeconds = clamp(Number(raw) || 0, 0, 59);
          onChange({ minutes, seconds: nextSeconds });
        }}
        onBlur={() => {
          onChange({
            minutes: clamp(minutes, 0, minuteMax),
            seconds: clamp(seconds, 0, 59),
          });
        }}
      />
    </div>
  );
};

export default DurationMinutesSeconds;

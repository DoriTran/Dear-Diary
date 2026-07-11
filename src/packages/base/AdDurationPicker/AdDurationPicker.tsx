import type { FC } from 'react';

import { TimePicker } from '@mantine/dates';
import clsx from 'clsx';

import formFieldStyles from '@/packages/base/formField/formField.module.css';

import styles from './AdDurationPicker.module.css';
import {
  durationMsToEditParts,
  editPartsToDurationMs,
  MAX_MINUTES_PER_DAY,
} from './durationEdit.utils';
import DurationMinutesSeconds from './DurationMinutesSeconds';
import { useTimePopoverAlign } from './useTimePopoverAlign';

export type AdDurationPickerProps = {
  valueMs: number;
  onChange: (valueMs: number) => void;
  disableDay?: boolean;
  disableHour?: boolean;
  disabled?: boolean;
  compact?: boolean;
  appearance?: 'field' | 'inline';
  className?: string;
};

const timePickerClassNames = {
  root: styles.pickerRoot,
  wrapper: styles.wrapper,
  input: styles.input,
  fieldsRoot: styles.fieldsRoot,
  fieldsGroup: styles.fieldsGroup,
  field: styles.field,
  dropdown: styles.dropdown,
  control: styles.control,
};

const AdDurationPicker: FC<AdDurationPickerProps> = ({
  valueMs,
  onChange,
  disableDay = false,
  disableHour = false,
  disabled = false,
  compact = false,
  appearance = 'inline',
  className,
}) => {
  const isInline = appearance === 'inline';
  const mode = { disableDay, disableHour };
  const parts = durationMsToEditParts(valueMs, mode);

  const updateMs = (nextParts: Parameters<typeof editPartsToDurationMs>[0]) => {
    onChange(editPartsToDurationMs(nextParts, mode));
  };

  const showDays = !disableDay;
  const useMinutesSeconds = disableHour;
  const showTimeDropdown = !useMinutesSeconds && !disableDay;
  const { containerRef: timeSegmentRef, crossAxisOffset } = useTimePopoverAlign(
    showTimeDropdown,
    [parts.days, parts.time, showDays, compact],
  );

  return (
    <div className={clsx(styles.shell, className)}>
      <div className={styles.durationRow}>
        {showDays && (
          <span className={styles.daysSegment}>
            <input
              type="text"
              inputMode="numeric"
              disabled={disabled}
              aria-label="Days"
              className={clsx(styles.field, styles.daysField)}
              style={{
                width: `${Math.max(1, String(parts.days ?? 0).length)}ch`,
              }}
              value={parts.days ?? 0}
              onChange={(event) => {
                const days = Math.max(
                  0,
                  Number(event.target.value.replace(/\D/g, '')) || 0,
                );
                updateMs({ ...parts, days });
              }}
            />
            <span className={styles.unitSuffix}>d</span>
          </span>
        )}

        {useMinutesSeconds ? (
          <DurationMinutesSeconds
            compact={compact}
            disabled={disabled}
            minutes={parts.minutes ?? 0}
            seconds={parts.seconds ?? 0}
            maxMinutes={
              disableDay ? Number.MAX_SAFE_INTEGER : MAX_MINUTES_PER_DAY
            }
            onChange={({ minutes, seconds }) => {
              updateMs({
                ...parts,
                minutes,
                seconds,
              });
            }}
          />
        ) : (
          <div ref={timeSegmentRef} className={styles.timeSegment}>
            <TimePicker
              withSeconds
              withDropdown={!disableDay}
              {...(disableDay
                ? { type: 'duration' as const }
                : { type: 'time' as const })}
              variant={isInline ? 'unstyled' : 'default'}
              value={parts.time ?? '00:00:00'}
              disabled={disabled}
              className={clsx(
                !isInline && formFieldStyles.control,
                styles.root,
                isInline && styles.inline,
                compact && styles.compact,
              )}
              classNames={timePickerClassNames}
              popoverProps={{
                withinPortal: true,
                position: 'bottom',
                offset: { mainAxis: 8, crossAxis: crossAxisOffset },
                middlewares: { shift: false },
              }}
              onChange={(time) => {
                updateMs({
                  ...parts,
                  time: time ?? (disableDay ? '0:00:00' : '00:00:00'),
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdDurationPicker;

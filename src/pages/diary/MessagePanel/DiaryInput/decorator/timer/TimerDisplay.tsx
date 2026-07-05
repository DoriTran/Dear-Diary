import type { FC } from 'react';

import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

import type { TimerDecorator } from '@/store/diary/type';

import {
  AdDateTimePicker,
  AdDurationPicker,
  AdIcon,
  AdInput,
} from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import {
  durationMsToParts,
  getTimerDisplayText,
  partsToDurationMs,
} from './timer.utils';
import styles from './timerCharms.module.css';

type TimerDisplayProps = {
  decoration: TimerDecorator;
  decoratorIndex: number;
  ctx: ComposerContext;
};

const TimerDisplay: FC<TimerDisplayProps> = ({
  decoration,
  decoratorIndex,
  ctx,
}) => {
  const timer = decoration;
  const { composing, updateDecorator } = ctx;

  const update = (next: TimerDecorator) => {
    updateDecorator(decoratorIndex, next);
  };

  if (composing && timer.mode === 'timer') {
    const parts = durationMsToParts(timer.durationMs);

    return (
      <div className={styles.displayRow}>
        <AdIcon icon={faStopwatch} size={12} />
        <div className={styles.durationEditor}>
          <AdInput
            type="number"
            min={0}
            className={styles.daysInput}
            value={parts.days}
            aria-label="Days"
            onChange={(event) => {
              const days = Math.max(0, Number(event.target.value) || 0);
              update({
                ...timer,
                durationMs: partsToDurationMs({ days, time: parts.time }),
              });
            }}
          />
          <span className={styles.daysLabel}>d</span>
          <AdDurationPicker
            compact
            value={parts.time}
            onChange={(time) => {
              update({
                ...timer,
                durationMs: partsToDurationMs({ days: parts.days, time }),
              });
            }}
          />
        </div>
      </div>
    );
  }

  if (composing && timer.mode === 'datetime') {
    return (
      <div className={styles.displayRow}>
        <AdIcon icon={faStopwatch} size={12} />
        <AdDateTimePicker
          compact
          value={timer.targetDate}
          onChange={(value) => {
            if (!value) {
              return;
            }

            update({
              ...timer,
              targetDate: new Date(value).toISOString(),
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.displayRow}>
      <AdIcon icon={faStopwatch} size={12} />
      <span className={styles.displayText}>
        {composing && timer.mode === 'countup'
          ? '00:00'
          : getTimerDisplayText(timer)}
      </span>
    </div>
  );
};

export default TimerDisplay;

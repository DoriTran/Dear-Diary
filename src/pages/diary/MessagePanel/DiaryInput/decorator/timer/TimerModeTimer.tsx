import type { FC } from 'react';

import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

import type { TimerDecorator } from '@/store/diary/type';

import { AdDurationPicker, AdIcon, AdInput } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import {
  durationMsToParts,
  getTimerDisplayText,
  partsToDurationMs,
} from './timer.utils';
import styles from './timerCharms.module.css';

type TimerModeTimerProps = {
  decoration: TimerDecorator;
  decoratorIndex: number;
  ctx: ComposerContext;
};

const TimerModeTimer: FC<TimerModeTimerProps> = ({
  decoration,
  decoratorIndex,
  ctx,
}) => {
  const timer = decoration;
  const { composing, updateDecorator } = ctx;

  const update = (next: TimerDecorator) => {
    updateDecorator(decoratorIndex, next);
  };

  if (composing) {
    const parts = durationMsToParts(timer.durationMs);

    return (
      <div className={styles.modePanel}>
        <AdIcon icon={faStopwatch} size={18} />
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

  return (
    <div className={styles.modePanel}>
      <AdIcon icon={faStopwatch} size={18} />
      <span className={styles.displayText}>{getTimerDisplayText(timer)}</span>
    </div>
  );
};

export default TimerModeTimer;

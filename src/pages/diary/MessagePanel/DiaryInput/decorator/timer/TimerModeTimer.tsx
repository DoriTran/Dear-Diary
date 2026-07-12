import type { FC } from 'react';

import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

import type { TimerDecorator } from '@/store/diary/type';

import { AdDurationPicker, AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import { getTimerDisplayText } from './timer.utils';
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
    return (
      <div className={styles.modePanel}>
        <AdIcon icon={faStopwatch} size={18} />
        <AdDurationPicker
          className={styles.composerPill}
          compact
          valueMs={timer.durationMs}
          onChange={(durationMs) => {
            update({ ...timer, durationMs });
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.modePanel}>
      <AdIcon icon={faStopwatch} size={28} />
      <span className={styles.displayText}>{getTimerDisplayText(timer)}</span>
    </div>
  );
};

export default TimerModeTimer;

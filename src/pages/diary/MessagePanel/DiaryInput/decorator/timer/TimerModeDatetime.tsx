import type { FC } from 'react';

import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

import type { TimerDecorator } from '@/store/diary/type';

import { AdDateTimePicker, AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import { getTimerDisplayText } from './timer.utils';
import styles from './timerCharms.module.css';

type TimerModeDatetimeProps = {
  decoration: TimerDecorator;
  decoratorIndex: number;
  ctx: ComposerContext;
};

const TimerModeDatetime: FC<TimerModeDatetimeProps> = ({
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
        <AdDateTimePicker
          compact
          className={styles.composerPill}
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
    <div className={styles.modePanel}>
      <AdIcon icon={faStopwatch} size={28} />
      <span className={styles.displayText}>{getTimerDisplayText(timer)}</span>
    </div>
  );
};

export default TimerModeDatetime;

import type { FC } from 'react';

import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

import type { TimerDecorator } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import { getTimerDisplayText } from './timer.utils';
import styles from './timerCharms.module.css';

type TimerModeCountupProps = {
  decoration: TimerDecorator;
  ctx: ComposerContext;
};

const TimerModeCountup: FC<TimerModeCountupProps> = ({ decoration, ctx }) => {
  return (
    <div className={styles.modePanel}>
      <AdIcon icon={faStopwatch} size={18} />
      <span className={styles.displayText}>
        {ctx.composing ? '00:00' : getTimerDisplayText(decoration)}
      </span>
    </div>
  );
};

export default TimerModeCountup;

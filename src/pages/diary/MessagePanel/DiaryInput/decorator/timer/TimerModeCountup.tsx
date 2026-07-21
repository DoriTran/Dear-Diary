import type { FC } from 'react';

import { faClock } from '@fortawesome/free-solid-svg-icons';

import type { TimerDecorator } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import { getTimerDisplayText } from './timer.utils';
import styles from './timerCharms.module.css';
import TimerDisplayText from './TimerDisplayText';

type TimerModeCountupProps = {
  decoration: TimerDecorator;
  ctx: ComposerContext;
};

const TimerModeCountup: FC<TimerModeCountupProps> = ({ decoration, ctx }) => {
  return (
    <div className={styles.modePanel}>
      <AdIcon icon={faClock} size={ctx.composing ? 24 : 28} />
      {ctx.composing ? (
        <span
          className={`${styles.composerPill} ${styles.composerStatusText} ${styles.composerPillDisabled}`}
          aria-disabled="true"
        >
          00:00
        </span>
      ) : (
        <TimerDisplayText text={getTimerDisplayText(decoration)} />
      )}
    </div>
  );
};

export default TimerModeCountup;

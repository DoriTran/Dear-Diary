import type { FC } from 'react';

import {
  faPause,
  faPlay,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import type { ComposerContext } from '../charms/charm.types';

import styles from './timerCharms.module.css';

type TimerControlsProps = {
  ctx: ComposerContext;
};

const TimerControls: FC<TimerControlsProps> = ({ ctx }) => {
  const disabled = ctx.composing;

  const timer = ctx.decorators.find((d) => d.type === 'timer');
  if (!timer || timer.type !== 'timer' || timer.mode === 'datetime') {
    return null;
  }

  const isRunning = timer.running && !timer.pause;

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${styles.controlBtn} ${disabled ? styles.controlBtnDisabled : ''}`}
        aria-label={isRunning ? 'Pause timer' : 'Play timer'}
        disabled={disabled}
        onClick={() =>
          ctx.emit({
            decorator: 'timer',
            action: isRunning ? 'pause' : 'play',
          })
        }
      >
        <AdIcon icon={isRunning ? faPause : faPlay} size={16} />
      </button>
      <button
        type="button"
        className={`${styles.controlBtn} ${disabled ? styles.controlBtnDisabled : ''}`}
        aria-label="Reset timer"
        disabled={disabled}
        onClick={() => ctx.emit({ decorator: 'timer', action: 'reset' })}
      >
        <AdIcon icon={faRotateLeft} size={16} />
      </button>
    </div>
  );
};

export default TimerControls;

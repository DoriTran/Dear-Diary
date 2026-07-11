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

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${styles.controlBtn} ${disabled ? styles.controlBtnDisabled : ''}`}
        aria-label="Play timer"
        disabled={disabled}
        onClick={() => ctx.emit({ decorator: 'timer', action: 'play' })}
      >
        <AdIcon icon={faPlay} size={18} />
      </button>
      <button
        type="button"
        className={`${styles.controlBtn} ${disabled ? styles.controlBtnDisabled : ''}`}
        aria-label="Pause timer"
        disabled={disabled}
        onClick={() => ctx.emit({ decorator: 'timer', action: 'pause' })}
      >
        <AdIcon icon={faPause} size={18} />
      </button>
      <button
        type="button"
        className={`${styles.controlBtn} ${disabled ? styles.controlBtnDisabled : ''}`}
        aria-label="Reset timer"
        disabled={disabled}
        onClick={() => ctx.emit({ decorator: 'timer', action: 'reset' })}
      >
        <AdIcon icon={faRotateLeft} size={18} />
      </button>
    </div>
  );
};

export default TimerControls;

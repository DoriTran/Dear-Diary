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
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.controlBtn}
        aria-label="Play timer"
        onClick={() => ctx.emit({ decorator: 'timer', action: 'play' })}
      >
        <AdIcon icon={faPlay} size={10} />
      </button>
      <button
        type="button"
        className={styles.controlBtn}
        aria-label="Pause timer"
        onClick={() => ctx.emit({ decorator: 'timer', action: 'pause' })}
      >
        <AdIcon icon={faPause} size={10} />
      </button>
      <button
        type="button"
        className={styles.controlBtn}
        aria-label="Reset timer"
        onClick={() => ctx.emit({ decorator: 'timer', action: 'reset' })}
      >
        <AdIcon icon={faRotateLeft} size={10} />
      </button>
    </div>
  );
};

export default TimerControls;

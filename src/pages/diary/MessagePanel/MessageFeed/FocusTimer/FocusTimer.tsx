import { faClock, faPlay } from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import { AdIcon } from '@/packages/base';

import styles from './FocusTimer.module.css';

export type FocusTimerProps = {
  label: string;
  duration: string;
};

const FocusTimer: FC<FocusTimerProps> = ({ label, duration }) => {
  return (
    <div className={styles.root}>
      <span className={styles.iconWrap} aria-hidden>
        <AdIcon icon={faClock} size={14} />
      </span>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.duration}>{duration}</span>
      </div>
      <button type="button" className={styles.playBtn} aria-label="Start timer">
        <AdIcon icon={faPlay} size={11} />
      </button>
    </div>
  );
};

export default FocusTimer;

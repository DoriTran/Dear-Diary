import type { FC } from 'react';

import clsx from 'clsx';

import styles from './timerCharms.module.css';

type TimerDisplayTextProps = {
  text: string;
  className?: string;
};

const TimerDisplayText: FC<TimerDisplayTextProps> = ({ text, className }) => {
  const sizer = text.replace(/\d/g, '0');

  return (
    <span
      className={clsx(styles.displayText, styles.displayTextSlot, className)}
    >
      <span aria-hidden className={styles.displayTextSizer}>
        {sizer}
      </span>
      <span className={styles.displayTextValue}>{text}</span>
    </span>
  );
};

export default TimerDisplayText;

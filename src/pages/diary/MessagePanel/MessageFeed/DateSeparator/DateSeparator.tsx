import type { FC } from 'react';

import styles from './DateSeparator.module.css';

export type DateSeparatorProps = {
  label: string;
};

const DateSeparator: FC<DateSeparatorProps> = ({ label }) => {
  return (
    <div className={styles.root} role="separator" aria-label={label}>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default DateSeparator;

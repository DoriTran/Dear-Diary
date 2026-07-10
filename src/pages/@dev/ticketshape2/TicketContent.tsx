import type { FC } from 'react';

import styles from './TicketContent.module.css';

const TicketContent: FC = () => (
  <div className={styles.root}>
    <div className={styles.checkCircle} aria-hidden>
      <svg viewBox="0 0 24 24" className={styles.checkIcon}>
        <path
          d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
          fill="currentColor"
        />
      </svg>
    </div>
    <span className={styles.label}>ShapePath ticket</span>
  </div>
);

export default TicketContent;

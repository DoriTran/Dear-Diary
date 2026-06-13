import type { FC, ReactNode } from 'react';

import { faCheck, faTicket } from '@fortawesome/free-solid-svg-icons';

import type { TicketDecoration as TicketDecorationType } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';

import styles from './TicketDecoration.module.css';

export type TicketDecorationProps = {
  decoration: TicketDecorationType;
  composing?: boolean;
  onComplete?: () => void;
  children: ReactNode;
};

const TicketDecoration: FC<TicketDecorationProps> = ({
  composing = true,
  onComplete,
  children,
}) => {
  return (
    <div className={styles.shell}>
      <div className={styles.innerColumn}>
        <div className={styles.header}>
          <AdIcon icon={faTicket} size={11} />
          <span>Ticket</span>
        </div>
        <div className={styles.body}>
          <div className={styles.main}>{children}</div>
          <div className={styles.stub}>
            <button
              type="button"
              className={`${styles.completeBtn} ${composing ? '' : styles.completeBtnActive}`}
              aria-label="Complete ticket"
              disabled={composing}
              onClick={onComplete}
            >
              <AdIcon icon={faCheck} size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDecoration;

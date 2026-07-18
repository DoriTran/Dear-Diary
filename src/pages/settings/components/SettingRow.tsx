import type { FC, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './SettingRow.module.css';
import SuggestedBadge from './SuggestedBadge';

export type SettingRowProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Marks the setting as not-yet-available (renders a badge, dims the row). */
  suggested?: boolean;
  /** Render the control beneath the label instead of beside it. */
  stacked?: boolean;
  control?: ReactNode;
  children?: ReactNode;
};

const SettingRow: FC<SettingRowProps> = ({
  title,
  description,
  suggested = false,
  stacked = false,
  control,
  children,
}) => {
  return (
    <div
      className={clsx(
        styles.row,
        stacked && styles.stacked,
        suggested && styles.suggested,
      )}
      data-suggested={suggested || undefined}
    >
      <div className={styles.info}>
        <div className={styles.titleLine}>
          <span className={styles.title}>{title}</span>
          {suggested ? <SuggestedBadge /> : null}
        </div>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
      {control != null || children != null ? (
        <div className={styles.control}>
          {control}
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default SettingRow;

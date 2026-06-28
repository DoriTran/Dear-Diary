import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

import styles from './formField.module.css';

export type AdFieldProps = {
  label?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

/** Label + control column layout for forms. */
const AdField: FC<AdFieldProps> = ({ label, htmlFor, children, className }) => (
  <div className={clsx(styles.field, className)}>
    {label ? (
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
    ) : null}
    {children}
  </div>
);

export default AdField;

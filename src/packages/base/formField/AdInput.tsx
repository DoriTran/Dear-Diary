import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

import styles from './formField.module.css';

export type AdInputProps = InputHTMLAttributes<HTMLInputElement>;

/** Theme-aware text input. Use for all new form fields. */
const AdInput = forwardRef<HTMLInputElement, AdInputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(styles.control, className)}
      {...props}
    />
  ),
);

AdInput.displayName = 'AdInput';

export default AdInput;

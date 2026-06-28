import clsx from 'clsx';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

import styles from './formField.module.css';

export type AdTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Theme-aware textarea. Use for all new form fields. */
const AdTextarea = forwardRef<HTMLTextAreaElement, AdTextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(styles.control, styles.controlTextarea, className)}
      {...props}
    />
  ),
);

AdTextarea.displayName = 'AdTextarea';

export default AdTextarea;

import type { ButtonHTMLAttributes, FC } from 'react';

import clsx from 'clsx';

import styles from './ActionButton.module.css';

export type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'danger';
};

const ActionButton: FC<ActionButtonProps> = ({
  variant = 'default',
  className,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      className={clsx(styles.button, styles[variant], className)}
      type={type}
      {...rest}
    />
  );
};

export default ActionButton;

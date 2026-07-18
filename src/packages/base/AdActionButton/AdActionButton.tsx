import { forwardRef, type MouseEventHandler } from 'react';

import AdIcon, { type IconValue } from '../AdIcon/AdIcon';
import AdTooltip from '../AdTooltip/AdTooltip';
import styles from './AdActionButton.module.css';

export type AdActionButtonProps = {
  icon: IconValue;
  label: string;
  active?: boolean;
  size?: number;
  tooltip?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
};

const AdActionButton = forwardRef<HTMLButtonElement, AdActionButtonProps>(
  (
    {
      icon,
      label,
      onClick,
      active = false,
      size = 14,
      tooltip = true,
      disabled = false,
      type = 'button',
    },
    ref,
  ) => {
    const button = (
      <button
        ref={ref}
        type={type}
        className={styles.root}
        data-active={active || undefined}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        <AdIcon icon={icon} size={size} />
      </button>
    );

    if (!tooltip) {
      return button;
    }

    return (
      <AdTooltip label={label} position="top" withArrow={false}>
        {button}
      </AdTooltip>
    );
  },
);

AdActionButton.displayName = 'AdActionButton';

export default AdActionButton;

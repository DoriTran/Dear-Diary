import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import { Icon, type IconProps } from '@/packages/base';

import styles from './RoundMenu.module.css';

export interface RoundMenuProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  icon: IconProps['icon'];
  iconSize?: IconProps['size'];
  /** Small overlapping circle with a down caret at ~4 o'clock */
  showCaret?: boolean;
  caretSize?: IconProps['size'];
  children?: ReactNode;
}

const RoundMenu: FC<RoundMenuProps> = ({
  icon,
  iconSize = 32,
  showCaret = false,
  caretSize = 16,
  children,
  className,
  type = 'button',
  ...rest
}) => {
  return (
    <button type={type} className={clsx(styles.root, className)} {...rest}>
      <span className={styles.inner}>
        <Icon icon={icon} size={iconSize} color="var(--primary-dark)" />
        {children}
      </span>
      {showCaret && (
        <span className={styles.caretBadge} aria-hidden>
          <Icon
            icon={faChevronDown}
            size={caretSize}
            color="var(--primary-dark)"
          />
        </span>
      )}
    </button>
  );
};

export default RoundMenu;

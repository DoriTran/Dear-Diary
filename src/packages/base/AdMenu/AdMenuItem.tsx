import type { FC, MouseEvent, ReactNode } from 'react';

import styles from './AdMenu.module.css';

export type AdMenuItemProps = {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  destructive?: boolean;
  centered?: boolean;
  disabled?: boolean;
};

const AdMenuItem: FC<AdMenuItemProps> = ({
  children,
  onClick,
  destructive = false,
  centered = false,
  disabled = false,
}) => {
  return (
    <li role="none">
      <button
        type="button"
        role="menuitem"
        className={styles.menuItem}
        data-destructive={destructive || undefined}
        data-centered={centered || undefined}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
};

export default AdMenuItem;

import type { FC, MouseEvent, ReactNode } from 'react';

import styles from './AdMenu.module.css';

export type AdMenuItemProps = {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  destructive?: boolean;
};

const AdMenuItem: FC<AdMenuItemProps> = ({
  children,
  onClick,
  destructive = false,
}) => {
  return (
    <li role="none">
      <button
        type="button"
        role="menuitem"
        className={styles.menuItem}
        data-destructive={destructive || undefined}
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
};

export default AdMenuItem;

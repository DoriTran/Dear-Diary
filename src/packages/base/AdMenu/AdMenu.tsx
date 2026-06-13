import type { FC, ReactNode } from 'react';

import AdPopover, { type AdPopoverProps } from '../AdPopover/AdPopover';
import styles from './AdMenu.module.css';

export type AdMenuProps = Omit<AdPopoverProps, 'children'> & {
  children: ReactNode;
};

const AdMenu: FC<AdMenuProps> = ({ children, classNames, ...popoverProps }) => {
  const mergedClassNames =
    typeof classNames === 'object' && classNames !== null
      ? { ...classNames, dropdown: classNames.dropdown ?? styles.menu }
      : { dropdown: styles.menu };

  return (
    <AdPopover {...popoverProps} classNames={mergedClassNames}>
      <ul className={styles.menuList} role="menu">
        {children}
      </ul>
    </AdPopover>
  );
};

export default AdMenu;

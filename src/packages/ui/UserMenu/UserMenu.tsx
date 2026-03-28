import type { FC, HTMLAttributes } from 'react';

import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import RoundMenu from './RoundMenu/RoundMenu';
import styles from './UserMenu.module.css';

export type UserMenuProps = HTMLAttributes<HTMLDivElement>;

const UserMenu: FC<UserMenuProps> = ({ className, ...rest }) => {
  return (
    <div className={clsx(styles.row, className)} {...rest}>
      <RoundMenu icon={faBell} aria-label="Notifications" />
      <RoundMenu icon={faUser} showCaret aria-label="Account menu" />
    </div>
  );
};

export default UserMenu;

import type { FC } from 'react';

import { Outlet as RouterOutlet } from 'react-router-dom';

import Navigation from './Navigation/Navigation';
import styles from './Outlet.module.css';
import UserMenu from './UserMenu/UserMenu';

const Outlet: FC = () => {
  return (
    <div className={styles.root}>
      <Navigation />
      <UserMenu />
      <RouterOutlet />
    </div>
  );
};

export default Outlet;

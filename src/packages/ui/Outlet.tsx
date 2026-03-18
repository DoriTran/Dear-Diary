import type { FC } from 'react';

import { Outlet as RouterOutlet } from 'react-router-dom';

import Navigation from './Navigation/Navigation';
import styles from './Outlet.module.css';

const Outlet: FC = () => {
  return (
    <div className={styles.root}>
      <Navigation />
      <RouterOutlet />
    </div>
  );
};

export default Outlet;

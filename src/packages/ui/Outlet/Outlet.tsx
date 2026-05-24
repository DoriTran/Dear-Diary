import type { FC } from 'react';

import { Outlet as RouterOutlet } from 'react-router-dom';

import LeftPanel from './LeftPanel/LeftPanel';
import styles from './Outlet.module.css';

const Outlet: FC = () => {
  return (
    <div className={styles.root}>
      <LeftPanel />
      <RouterOutlet />
    </div>
  );
};

export default Outlet;

import type { FC } from 'react';

import Create from '../Create/Create';
import styles from './Header.module.css';

const Header: FC = () => {
  return (
    <header className={styles.root}>
      <h1 className={styles.title}>My Diary</h1>
      <Create />
    </header>
  );
};

export default Header;

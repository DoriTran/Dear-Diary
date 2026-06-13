import type { FC } from 'react';

import Create from '../Create/Create';
import styles from './Header.module.css';

export type HeaderProps = {
  onOpenCreate: (entity: 'chatbox' | 'group') => void;
};

const Header: FC<HeaderProps> = ({ onOpenCreate }) => {
  return (
    <header className={styles.root}>
      <h1 className={styles.title}>My Diary</h1>
      <Create onOpenCreate={onOpenCreate} />
    </header>
  );
};

export default Header;

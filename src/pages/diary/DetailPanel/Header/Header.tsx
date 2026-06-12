import type { FC } from 'react';

import { faEllipsis, faThumbtack } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import styles from './Header.module.css';

const Header: FC = () => {
  return (
    <header className={styles.root}>
      <h2 className={styles.title}>Details &amp; Organization</h2>
      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} aria-label="Pin panel">
          <AdIcon icon={faThumbtack} size={14} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="More options"
        >
          <AdIcon icon={faEllipsis} size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;

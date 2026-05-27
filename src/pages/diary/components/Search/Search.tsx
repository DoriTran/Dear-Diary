import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
import type { FC } from 'react';

import { AdIcon } from '@/packages/base';

import styles from './Search.module.css';

const Search: FC = () => {
  return (
    <div className={styles.root}>
      <span className={styles.leadingIcon} aria-hidden>
        <AdIcon icon={faMagnifyingGlass} size={14} />
      </span>
      <input
        className={styles.input}
        type="search"
        placeholder="Search chatboxes..."
        readOnly
        aria-label="Search chatboxes"
      />
      <button className={styles.filterBtn} type="button" aria-label="Filter options">
        <AdIcon icon={faSliders} size={14} />
      </button>
    </div>
  );
};

export default Search;

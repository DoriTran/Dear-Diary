import type { ChangeEvent, FC } from 'react';

import {
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import styles from './Search.module.css';

export type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const Search: FC<SearchProps> = ({ value, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.root}>
      <span className={styles.leadingIcon} aria-hidden>
        <AdIcon icon={faMagnifyingGlass} size={14} />
      </span>
      <input
        className={styles.input}
        type="search"
        placeholder="Search chatboxes..."
        value={value}
        onChange={handleChange}
        aria-label="Search chatboxes"
      />
      <button
        className={styles.filterBtn}
        type="button"
        aria-label="Filter options"
      >
        <AdIcon icon={faSliders} size={14} />
      </button>
    </div>
  );
};

export default Search;

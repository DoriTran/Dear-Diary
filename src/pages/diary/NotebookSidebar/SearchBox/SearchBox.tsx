import type { FC } from 'react';

import noteclip from '@/assets/decoration/noteclip.png';

import styles from './SearchBox.module.css';

export type SearchBoxProps = {
  searchText: string;
  setSearchText: (value: string) => void;
};

const SearchBox: FC<SearchBoxProps> = ({ searchText, setSearchText }) => {
  return (
    <div className={styles.root}>
      <div className={styles.clipWrapper}>
        <img
          alt="Noteclip Left"
          src={noteclip}
          width={40}
          height={80}
          draggable={false}
        />
        <img
          alt="Noteclip Right"
          src={noteclip}
          width={40}
          height={80}
          draggable={false}
        />
      </div>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search for chat ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;

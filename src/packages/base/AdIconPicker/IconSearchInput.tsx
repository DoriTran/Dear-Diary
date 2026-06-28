import type { FC } from 'react';

import { LucideIconById } from '@/packages/icon';

import styles from './IconSearchInput.module.css';

export type IconSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const IconSearchInput: FC<IconSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search icons... (e.g. book, heart, flower)',
  autoFocus = false,
  onKeyDown,
}) => {
  return (
    <div className={styles.iconSearchWrap}>
      <span className={styles.iconSearchIcon} aria-hidden>
        <LucideIconById iconId="Search" size={14} />
      </span>
      <input
        type="search"
        className={styles.iconSearchInput}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search icons"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default IconSearchInput;

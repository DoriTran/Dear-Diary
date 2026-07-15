import { useEffect, useRef, type FC, type KeyboardEvent } from 'react';

import { LucideIconById } from '@/packages/icon';

import styles from './IconSearchInput.module.css';

export type IconSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  focusOnMount?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const IconSearchInput: FC<IconSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search icons... (e.g. book, heart, flower)',
  focusOnMount = false,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnMount) {
      inputRef.current?.focus();
    }
  }, [focusOnMount]);

  return (
    <div className={styles.iconSearchWrap}>
      <span className={styles.iconSearchIcon} aria-hidden>
        <LucideIconById iconId="Search" size={14} />
      </span>
      <input
        ref={inputRef}
        type="search"
        className={styles.iconSearchInput}
        value={value}
        placeholder={placeholder}
        aria-label="Search icons"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default IconSearchInput;

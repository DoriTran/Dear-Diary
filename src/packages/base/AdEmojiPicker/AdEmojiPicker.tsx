import { useMemo, useState, type FC } from 'react';

import AdIcon from '../AdIcon/AdIcon';
import { AD_ICON_KEYS, resolveAdIcon } from '../AdIconPicker/iconPresets';
import styles from './AdEmojiPicker.module.css';
import { AD_COMPOSER_EMOJIS } from './emojiPresets';

export type AdEmojiPickerProps = {
  emojis?: readonly string[];
  iconKeys?: readonly string[];
  showIcons?: boolean;
  searchPlaceholder?: string;
  emojiLabel?: string;
  iconLabel?: string;
  onSelect: (value: string) => void;
};

const AdEmojiPicker: FC<AdEmojiPickerProps> = ({
  emojis = AD_COMPOSER_EMOJIS,
  iconKeys = AD_ICON_KEYS,
  showIcons = false,
  searchPlaceholder = 'Search emojis',
  emojiLabel = 'Emoji',
  iconLabel = 'Icons',
  onSelect,
}) => {
  const [query, setQuery] = useState('');

  const filteredIcons = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized || !showIcons) {
      return iconKeys;
    }

    return iconKeys.filter((key) => key.toLowerCase().includes(normalized));
  }, [iconKeys, query, showIcons]);

  const filteredEmojis = useMemo(() => {
    if (!query.trim()) {
      return emojis;
    }

    return emojis;
  }, [emojis, query]);

  return (
    <>
      <input
        className={styles.search}
        value={query}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p className={styles.sectionLabel}>{emojiLabel}</p>
      <div className={styles.grid}>
        {filteredEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={styles.emojiBtn}
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      {showIcons ? (
        <>
          <p className={styles.sectionLabel}>{iconLabel}</p>
          <div className={styles.iconGrid}>
            {filteredIcons.map((iconKey) => (
              <button
                key={iconKey}
                type="button"
                className={styles.iconBtn}
                aria-label={iconKey}
                onClick={() => onSelect(`[${iconKey}]`)}
              >
                <AdIcon icon={resolveAdIcon(iconKey)} size={12} />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};

export default AdEmojiPicker;

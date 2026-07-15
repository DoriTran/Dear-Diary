import { useMemo, useState, type FC } from 'react';

import type { IconId } from '@/packages/icon';

import { LucideIconById } from '@/packages/icon';

import styles from './AdEmojiPicker.module.css';
import { AD_COMPOSER_EMOJIS, AD_COMPOSER_ICON_IDS } from './emojiPresets';

export type AdEmojiPickerProps = {
  emojis?: readonly string[];
  iconIds?: readonly IconId[];
  showIcons?: boolean;
  searchPlaceholder?: string;
  emojiLabel?: string;
  iconLabel?: string;
  onSelect: (value: string) => void;
};

const AdEmojiPicker: FC<AdEmojiPickerProps> = ({
  emojis = AD_COMPOSER_EMOJIS,
  iconIds = AD_COMPOSER_ICON_IDS,
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
      return iconIds;
    }

    return iconIds.filter((id) => id.toLowerCase().includes(normalized));
  }, [iconIds, query, showIcons]);

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
            {filteredIcons.map((iconId) => (
              <button
                key={iconId}
                type="button"
                className={styles.iconBtn}
                aria-label={iconId}
                onClick={() => onSelect(`[${iconId}]`)}
              >
                <LucideIconById iconId={iconId} size={12} />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};

export default AdEmojiPicker;

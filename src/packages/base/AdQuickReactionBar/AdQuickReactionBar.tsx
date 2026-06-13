import type { FC } from 'react';

import { AD_DEFAULT_EMOJIS } from '../AdEmojiPicker/emojiPresets';
import styles from './AdQuickReactionBar.module.css';

export type AdQuickReactionBarProps = {
  emojis?: readonly string[];
  onSelect: (emoji: string) => void;
  onExpand?: () => void;
  expandLabel?: string;
};

const AdQuickReactionBar: FC<AdQuickReactionBarProps> = ({
  emojis = AD_DEFAULT_EMOJIS.slice(0, 5),
  onSelect,
  onExpand,
  expandLabel = 'More reactions',
}) => {
  return (
    <div className={styles.root}>
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className={styles.emojiBtn}
          aria-label={`React with ${emoji}`}
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
      {onExpand ? (
        <button
          type="button"
          className={styles.expandBtn}
          aria-label={expandLabel}
          onClick={onExpand}
        >
          +
        </button>
      ) : null}
    </div>
  );
};

export default AdQuickReactionBar;

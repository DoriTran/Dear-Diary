import type { FC } from 'react';

import type { MessageReaction } from '@/store/diary/type';

import { AdEmojiGlyph } from '@/packages/base';

import styles from './ReactionBar.module.css';

export type ReactionBarProps = {
  messageId: string;
  reactions: MessageReaction[];
  align?: 'start' | 'end';
  onToggle: (messageId: string, emoji: string) => void;
};

const ReactionBar: FC<ReactionBarProps> = ({
  messageId,
  reactions,
  align = 'end',
  onToggle,
}) => {
  if (reactions.length === 0) {
    return null;
  }

  return (
    <div className={styles.root} data-align={align}>
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          className={styles.chip}
          data-active={reaction.count > 0 || undefined}
          aria-label={`React with ${reaction.emoji}`}
          onClick={() => onToggle(messageId, reaction.emoji)}
        >
          <AdEmojiGlyph
            value={reaction.emoji}
            className={styles.glyph}
            imgClassName={styles.customImg}
          />
          {reaction.count > 1 ? (
            <span className={styles.count}>{reaction.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
};

export default ReactionBar;

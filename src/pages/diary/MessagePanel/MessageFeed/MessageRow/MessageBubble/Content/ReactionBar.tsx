import type { FC } from 'react';

import type { MessageReaction } from '@/store/diary/type';

import styles from './ReactionBar.module.css';

export type ReactionBarProps = {
  messageId: string;
  reactions: MessageReaction[];
  onToggle: (messageId: string, emoji: string) => void;
};

const ReactionBar: FC<ReactionBarProps> = ({
  messageId,
  reactions,
  onToggle,
}) => {
  if (reactions.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          className={styles.chip}
          data-active={reaction.count > 0 || undefined}
          onClick={() => onToggle(messageId, reaction.emoji)}
        >
          <span>{reaction.emoji}</span>
          {reaction.count > 1 ? <span>{reaction.count}</span> : null}
        </button>
      ))}
    </div>
  );
};

export default ReactionBar;

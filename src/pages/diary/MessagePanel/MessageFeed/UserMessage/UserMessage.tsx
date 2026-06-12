import type { FC } from 'react';

import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { AdIcon } from '@/packages/base';

import type { MessageItem } from '../../../types';

import styles from './UserMessage.module.css';

export type UserMessageProps = {
  message: MessageItem;
};

const UserMessage: FC<UserMessageProps> = ({ message }) => {
  return (
    <article className={styles.root}>
      <div className={styles.content}>
        <div className={styles.bubble}>
          {message.blocks.map((block, index) =>
            block.type === 'text' ? (
              <p key={index} className={styles.text}>
                {block.content}
              </p>
            ) : null,
          )}
          {message.reaction ? (
            <span className={styles.reaction}>
              {message.reaction.emoji} {message.reaction.count}
            </span>
          ) : null}
        </div>
        <div className={styles.meta}>
          <time className={styles.time}>{message.time}</time>
          {message.read ? (
            <span className={styles.read} aria-label="Read">
              <AdIcon icon={faCheck} size={10} />
            </span>
          ) : null}
        </div>
      </div>
      <span className={styles.avatar} aria-hidden>
        👧
      </span>
    </article>
  );
};

export default UserMessage;

import type { FC } from 'react';

import type { MessageDayGroup } from '../../types';
import AIMessage from './AIMessage/AIMessage';
import DateSeparator from './DateSeparator/DateSeparator';
import UserMessage from './UserMessage/UserMessage';
import styles from './MessageFeed.module.css';

export type MessageFeedProps = {
  groups: MessageDayGroup[];
};

const MessageFeed: FC<MessageFeedProps> = ({ groups }) => {
  return (
    <div className={styles.root}>
      {groups.map((group) => (
        <section key={group.date} className={styles.dayGroup}>
          <DateSeparator label={group.date} />
          <div className={styles.messages}>
            {group.messages.map((message) =>
              message.author === 'ai' ? (
                <AIMessage key={message.id} message={message} />
              ) : (
                <UserMessage key={message.id} message={message} />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MessageFeed;

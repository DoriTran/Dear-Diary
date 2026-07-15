import type { FC, RefObject } from 'react';

import type { MessageActionsAPI } from '../.hooks/useMessageActions';
import type { MessageDayGroup } from './message.utils';

import DateSeparator from './DateSeparator/DateSeparator';
import styles from './MessageFeed.module.css';
import MessageRow from './MessageRow/MessageRow';

export type MessageFeedProps = {
  groups: MessageDayGroup[];
  feedRef: RefObject<HTMLDivElement | null>;
  registerRef: (messageId: string, element: HTMLElement | null) => void;
  actions: MessageActionsAPI;
};

const MessageFeed: FC<MessageFeedProps> = ({
  groups,
  feedRef,
  registerRef,
  actions,
}) => {
  return (
    <div ref={feedRef} className={styles.root}>
      <div className={styles.inner}>
        {groups.map((group) => (
          <section key={group.date} className={styles.dayGroup}>
            <DateSeparator label={group.date} />
            <div className={styles.messages}>
              {group.messages.map((message) => (
                <MessageRow
                  key={message.id}
                  message={message}
                  registerRef={registerRef}
                  actions={actions}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default MessageFeed;

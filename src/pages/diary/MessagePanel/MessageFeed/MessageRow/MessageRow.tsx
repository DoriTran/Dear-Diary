import { memo, useEffect, useRef, type FC } from 'react';

import type { Message } from '@/store/diary/type';

import type { MessageActionsAPI } from '../../hooks/useMessageActions';

import HoverActions from '../HoverActions/HoverActions';
import MessageBubble from '../MessageBubble/MessageBubble';
import styles from './MessageRow.module.css';

export type MessageRowProps = {
  message: Message;
  registerRef: (messageId: string, element: HTMLElement | null) => void;
  actions: MessageActionsAPI;
};

const MessageRow: FC<MessageRowProps> = ({ message, registerRef, actions }) => {
  const rootRef = useRef<HTMLElement>(null);
  const isAssistant = (message.sender ?? 'user') === 'assistant';

  useEffect(() => {
    registerRef(message.id, rootRef.current);

    return () => registerRef(message.id, null);
  }, [message.id, registerRef]);

  return (
    <article
      ref={rootRef}
      className={styles.root}
      data-assistant={isAssistant || undefined}
      data-message-id={message.id}
    >
      <HoverActions
        message={message}
        actions={actions}
        side={isAssistant ? 'left' : 'right'}
        className={styles.hoverActions}
      />
      <div className={styles.bubbleWrap}>
        <MessageBubble
          message={message}
          onNavigateToMessage={actions.navigateToMessage}
        />
      </div>
    </article>
  );
};

export default memo(MessageRow);

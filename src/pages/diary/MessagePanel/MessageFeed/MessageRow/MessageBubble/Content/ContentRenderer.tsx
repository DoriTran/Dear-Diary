import type { FC } from 'react';

import type { Message } from '@/store/diary/type';

import { AdCheckbox } from '@/packages/base';
import { useDiaryStore } from '@/store';

import { getMessagePreviewText } from '../../../../messagePanel.utils';
import AttachmentList from './AttachmentList/AttachmentList';
import styles from './MessageContent.module.css';

export type ContentRendererProps = {
  message: Message;
  mode?: 'feed' | 'preview';
};

const ContentRenderer: FC<ContentRendererProps> = ({
  message,
  mode = 'feed',
}) => {
  const updateMessageContent = useDiaryStore('updateMessageContent');
  const align = message.sender === 'assistant' ? 'start' : 'end';

  if (mode === 'preview') {
    return <p className={styles.text}>{getMessagePreviewText(message)}</p>;
  }

  if (message.variant === 'todo') {
    return (
      <ul className={styles.todoList}>
        {message.content.items.map((item) => {
          const hasText = item.content.text.trim().length > 0;
          const hasAttachments = item.attachments.length > 0;

          return (
            <li key={item.id} className={styles.todoItem}>
              <div className={styles.checkbox}>
                <AdCheckbox
                  checked={item.completed}
                  aria-label={
                    hasText
                      ? `Mark ${item.content.text} complete`
                      : 'Mark todo complete'
                  }
                  onChange={() =>
                    updateMessageContent(message.id, {
                      content: {
                        items: message.content.items.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, completed: !entry.completed }
                            : entry,
                        ),
                      },
                    })
                  }
                />
              </div>
              <div className={styles.todoBody}>
                {hasText ? (
                  <span
                    className={`${styles.todoText} ${item.completed ? styles.todoTextDone : ''}`}
                  >
                    {item.content.text}
                  </span>
                ) : null}
                {hasAttachments ? (
                  <div
                    className={
                      item.completed ? styles.attachmentsDone : undefined
                    }
                  >
                    <AttachmentList
                      attachments={item.attachments}
                      align={align}
                      compact
                    />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  if (!message.content.text.trim()) {
    return null;
  }

  return <p className={styles.text}>{message.content.text}</p>;
};

export default ContentRenderer;

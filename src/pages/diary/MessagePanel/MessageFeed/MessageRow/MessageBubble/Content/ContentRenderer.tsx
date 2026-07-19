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
        {message.content.items.map((item) => (
          <li key={item.id} className={styles.todoItem}>
            <div className={styles.todoRow}>
              <AdCheckbox
                className={styles.checkbox}
                checked={item.completed}
                aria-label={`Mark ${item.content.text} complete`}
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
              <span
                className={`${styles.todoText} ${item.completed ? styles.todoTextDone : ''}`}
              >
                {item.content.text}
              </span>
            </div>
            {item.attachments.length > 0 ? (
              <div className={styles.rowAttachments}>
                <AttachmentList
                  attachments={item.attachments}
                  align={align}
                  compact
                />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  if (!message.content.text.trim()) {
    return null;
  }

  return <p className={styles.text}>{message.content.text}</p>;
};

export default ContentRenderer;

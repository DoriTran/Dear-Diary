import type { FC } from 'react';

import type { MessageBlock, MessageItem } from '../../../types';

import FocusTimer from '../FocusTimer/FocusTimer';
import styles from './AIMessage.module.css';

export type AIMessageProps = {
  message: MessageItem;
};

const renderBlock = (block: MessageBlock, index: number) => {
  switch (block.type) {
    case 'text':
      return (
        <p key={index} className={styles.text}>
          {block.content}
        </p>
      );
    case 'list':
      return (
        <ul key={index} className={styles.list}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'timer':
      return (
        <FocusTimer key={index} label={block.label} duration={block.duration} />
      );
    default:
      return null;
  }
};

const AIMessage: FC<AIMessageProps> = ({ message }) => {
  return (
    <article className={styles.root}>
      <span className={styles.avatar} aria-hidden>
        🐱
      </span>
      <div className={styles.content}>
        <span className={styles.name}>AI Assistant</span>
        <div className={`chat-bubble chat-bubble--text ${styles.bubble}`}>
          {message.blocks.map(renderBlock)}
        </div>
        <time className={styles.time}>{message.time}</time>
      </div>
    </article>
  );
};

export default AIMessage;

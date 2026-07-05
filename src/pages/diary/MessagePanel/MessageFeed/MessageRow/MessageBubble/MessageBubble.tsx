import type { FC } from 'react';

import { faCheck, faThumbtack } from '@fortawesome/free-solid-svg-icons';

import type { Message } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';
import { useDiaryStore } from '@/store';

import { formatMessageTime } from '../../message.utils';
import AttachmentList from './Content/AttachmentList';
import ContentRenderer from './Content/ContentRenderer';
import ForwardCard from './Content/ForwardCard';
import MessageDecoratorShell from './Content/MessageDecoratorShell';
import MessageTagRow from './Content/MessageTagRow';
import ReactionBar from './Content/ReactionBar';
import ReplyPreview from './Content/ReplyPreview';
import assistantStyles from './styles/assistantBubble.module.css';
import userStyles from './styles/userBubble.module.css';

export type MessageBubbleProps = {
  message: Message;
  onNavigateToMessage: (messageId: string) => void;
};

const MessageBubble: FC<MessageBubbleProps> = ({
  message,
  onNavigateToMessage,
}) => {
  const toggleMessageReaction = useDiaryStore('toggleMessageReaction');
  const isAssistant = (message.sender ?? 'user') === 'assistant';
  const time = formatMessageTime(message.createdAt);
  const captionText =
    message.variant === 'todo' ? '' : message.content.text.trim();
  const showBody = !message.sourceMessageId || captionText.length > 0;

  const bubbleBody = (
    <>
      {message.pinned ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '0.35rem',
            fontSize: 'var(--font-2xs)',
            color: 'var(--text-muted)',
          }}
        >
          <AdIcon icon={faThumbtack} size={9} />
          Pinned
        </span>
      ) : null}
      {message.replyToMessageId ? (
        <ReplyPreview
          replyToMessageId={message.replyToMessageId}
          onJump={onNavigateToMessage}
        />
      ) : null}
      {message.sourceMessageId ? (
        <ForwardCard
          sourceMessageId={message.sourceMessageId}
          onJump={onNavigateToMessage}
        />
      ) : null}
      {!message.sourceMessageId ? (
        <AttachmentList attachments={message.attachments} />
      ) : null}
      {!message.sourceMessageId ? (
        <MessageDecoratorShell
          messageId={message.id}
          decorators={message.decorators}
        >
          {showBody ? <ContentRenderer message={message} /> : null}
        </MessageDecoratorShell>
      ) : showBody ? (
        <ContentRenderer message={message} />
      ) : null}
      <MessageTagRow tagIds={message.tagIds} />
      <ReactionBar
        messageId={message.id}
        reactions={message.reactions}
        onToggle={toggleMessageReaction}
      />
    </>
  );

  if (isAssistant) {
    return (
      <article className={assistantStyles.root}>
        <span className={assistantStyles.avatar} aria-hidden>
          🐱
        </span>
        <div className={assistantStyles.content}>
          <span className={assistantStyles.name}>AI Assistant</span>
          <div
            className={`chat-bubble chat-bubble--text ${assistantStyles.bubble}`}
          >
            {bubbleBody}
          </div>
          <time className={assistantStyles.time}>{time}</time>
        </div>
      </article>
    );
  }

  return (
    <article className={userStyles.root}>
      <div className={userStyles.content}>
        <div className={userStyles.bubble}>{bubbleBody}</div>
        <div className={userStyles.meta}>
          <time className={userStyles.time}>{time}</time>
          {message.edited ? (
            <span className={userStyles.time}> · edited</span>
          ) : null}
          <span className={userStyles.read} aria-label="Sent">
            <AdIcon icon={faCheck} size={10} />
          </span>
        </div>
      </div>
      <span className={userStyles.avatar} aria-hidden>
        👧
      </span>
    </article>
  );
};

export default MessageBubble;

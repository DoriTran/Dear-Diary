import type { CSSProperties, FC, ReactNode } from 'react';

import { faCheck, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import type { Message } from '@/store/diary/type';

import { AdIcon } from '@/packages/base';
import { useDiaryStore } from '@/store';

import { formatMessageTime } from '../../message.utils';
import AttachmentList from './Content/AttachmentList/AttachmentList';
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
  /** Aligned to message core only (attachments + body), not tags/meta. */
  hoverActions?: ReactNode;
};

const MessageBubble: FC<MessageBubbleProps> = ({
  message,
  onNavigateToMessage,
  hoverActions = null,
}) => {
  const toggleMessageReaction = useDiaryStore('toggleMessageReaction');
  const isAssistant = (message.sender ?? 'user') === 'assistant';
  const styles = isAssistant ? assistantStyles : userStyles;
  const time = formatMessageTime(message.createdAt);
  const captionText =
    message.variant === 'todo' ? '' : message.content.text.trim();
  // Only render a body bubble when there is real content (not attachment-only empties).
  const showBody = message.variant === 'todo' || captionText.length > 0;
  const hasAttachments =
    !message.sourceMessageId && message.attachments.length > 0;
  const hasDecorators =
    !message.sourceMessageId && message.decorators.length > 0;
  const surfaceBg = isAssistant ? 'var(--chat-text-bg)' : 'var(--chat-user-bg)';

  const pinnedBadge = message.pinned ? (
    <span className={styles.pinned}>
      <AdIcon icon={faThumbtack} size={9} />
      Pinned
    </span>
  ) : null;

  const reply = message.replyToMessageId ? (
    <ReplyPreview
      replyToMessageId={message.replyToMessageId}
      onJump={onNavigateToMessage}
    />
  ) : null;

  const forward = message.sourceMessageId ? (
    <ForwardCard
      sourceMessageId={message.sourceMessageId}
      onJump={onNavigateToMessage}
    />
  ) : null;

  const attachments = hasAttachments ? (
    <AttachmentList
      attachments={message.attachments}
      align={isAssistant ? 'start' : 'end'}
    />
  ) : null;

  let body: ReactNode = null;

  if (hasDecorators) {
    body = (
      <MessageDecoratorShell
        messageId={message.id}
        decorators={message.decorators}
        attached={hasAttachments}
      >
        {showBody ? <ContentRenderer message={message} /> : null}
      </MessageDecoratorShell>
    );
  } else if (showBody) {
    body = (
      <div
        className={clsx(styles.bubble, hasAttachments && styles.bubbleAttached)}
      >
        <ContentRenderer message={message} />
      </div>
    );
  }

  const core = (
    <div
      className={styles.core}
      style={
        {
          '--message-surface-bg': surfaceBg,
        } as CSSProperties
      }
    >
      {pinnedBadge}
      {reply}
      {forward}
      {attachments}
      {body}
    </div>
  );

  const footer = (
    <div className={styles.footer}>
      <MessageTagRow tagIds={message.tagIds} />
      <ReactionBar
        messageId={message.id}
        reactions={message.reactions}
        onToggle={toggleMessageReaction}
      />
      {isAssistant ? (
        <time className={assistantStyles.time}>{time}</time>
      ) : (
        <div className={userStyles.meta}>
          <time className={userStyles.time}>{time}</time>
          {message.edited ? (
            <span className={userStyles.time}> · edited</span>
          ) : null}
          <span className={userStyles.read} aria-label="Sent">
            <AdIcon icon={faCheck} size={10} />
          </span>
        </div>
      )}
    </div>
  );

  if (isAssistant) {
    return (
      <article className={assistantStyles.root}>
        <span className={assistantStyles.avatar} aria-hidden>
          🐱
        </span>
        <div className={assistantStyles.content}>
          <span className={assistantStyles.name}>AI Assistant</span>
          <div className={assistantStyles.mainRow}>
            {core}
            {hoverActions}
          </div>
          {footer}
        </div>
      </article>
    );
  }

  return (
    <article className={userStyles.root}>
      <div className={userStyles.content}>
        <div className={userStyles.mainRow}>
          {hoverActions}
          {core}
        </div>
        {footer}
      </div>
    </article>
  );
};

export default MessageBubble;

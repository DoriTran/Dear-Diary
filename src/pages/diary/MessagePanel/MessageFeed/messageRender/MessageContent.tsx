import type { FC } from 'react';

import type { Message } from '@/store/diary/type';

import ContentRenderer from './ContentRenderer';

export type MessageContentProps = {
  message: Message;
};

const MessageContent: FC<MessageContentProps> = ({ message }) => {
  return <ContentRenderer message={message} mode="feed" />;
};

export default MessageContent;

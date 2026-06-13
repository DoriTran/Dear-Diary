import type { FC, ReactNode } from 'react';

import type { MessageDecoration } from '@/store/diary/type';

import { useDiaryStore } from '@/store';

import CountdownDecoration from '../../Composer/decorations/CountdownDecoration/CountdownDecoration';
import TicketDecoration from '../../Composer/decorations/TicketDecoration/TicketDecoration';

export type MessageDecorationShellProps = {
  messageId: string;
  decorations: MessageDecoration[];
  children: ReactNode;
};

const MessageDecorationShell: FC<MessageDecorationShellProps> = ({
  messageId,
  decorations,
  children,
}) => {
  const updateMessage = useDiaryStore('updateMessage');

  const hasTicket = decorations.some((d) => d.type === 'ticket');
  const countdownIndex = decorations.findIndex((d) => d.type === 'countdown');
  const countdown = countdownIndex >= 0 ? decorations[countdownIndex] : null;
  const ticket = decorations.find((d) => d.type === 'ticket');

  let content = children;

  if (countdown && countdown.type === 'countdown') {
    content = (
      <CountdownDecoration
        decoration={countdown}
        composing={false}
        onChange={(next) =>
          updateMessage(messageId, {
            decorations: decorations.map((item, index) =>
              index === countdownIndex ? next : item,
            ),
          })
        }
        onPause={() =>
          updateMessage(messageId, {
            decorations: decorations.map((item, index) =>
              index === countdownIndex && item.type === 'countdown'
                ? { ...item, pause: !item.pause }
                : item,
            ),
          })
        }
        onEdit={() => {
          // Inline edit via countdown header fields when not composing
        }}
        onRemove={() =>
          updateMessage(messageId, {
            decorations: decorations.filter(
              (_, index) => index !== countdownIndex,
            ),
          })
        }
      >
        {content}
      </CountdownDecoration>
    );
  }

  if (hasTicket && ticket?.type === 'ticket') {
    content = (
      <TicketDecoration
        decoration={ticket}
        composing={false}
        onComplete={() =>
          updateMessage(messageId, {
            decorations: decorations.map((item) =>
              item.type === 'ticket'
                ? {
                    ...item,
                    state: item.state === 'done' ? 'todo' : 'done',
                    ticked: item.state !== 'done',
                  }
                : item,
            ),
          })
        }
      >
        {content}
      </TicketDecoration>
    );
  }

  return <>{content}</>;
};

export default MessageDecorationShell;

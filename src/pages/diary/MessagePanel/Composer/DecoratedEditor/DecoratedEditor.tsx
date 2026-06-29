import type { FC, ReactNode } from 'react';

import type {
  CountdownDecoration as CountdownDecorationType,
  MessageDecoration,
  TicketDecoration as TicketDecorationType,
} from '@/store/diary/type';

import CountdownDecoration from '../decorations/CountdownDecoration/CountdownDecoration';
import TicketDecoration from '../decorations/TicketDecoration/TicketDecoration';
import styles from './DecoratedEditor.module.css';

export type DecoratedEditorProps = {
  decorations: MessageDecoration[];
  composing?: boolean;
  borderless?: boolean;
  onUpdateDecoration?: (index: number, decoration: MessageDecoration) => void;
  children: ReactNode;
};

const DecoratedEditor: FC<DecoratedEditorProps> = ({
  decorations,
  composing = true,
  borderless = false,
  onUpdateDecoration,
  children,
}) => {
  const ticket = decorations.find(
    (decoration): decoration is TicketDecorationType =>
      decoration.type === 'ticket',
  );
  const countdownIndex = decorations.findIndex(
    (decoration) => decoration.type === 'countdown',
  );
  const countdown =
    countdownIndex >= 0
      ? (decorations[countdownIndex] as CountdownDecorationType)
      : null;

  let content = children;

  if (countdown) {
    content = (
      <CountdownDecoration
        decoration={countdown}
        composing={composing}
        onChange={(next) => onUpdateDecoration?.(countdownIndex, next)}
      >
        {content}
      </CountdownDecoration>
    );
  }

  if (ticket) {
    content = (
      <TicketDecoration decoration={ticket} composing={composing}>
        {content}
      </TicketDecoration>
    );
  }

  const shellClass =
    ticket || countdown
      ? styles.decorated
      : borderless
        ? styles.plainBorderless
        : styles.plain;

  return <div className={shellClass}>{content}</div>;
};

export default DecoratedEditor;

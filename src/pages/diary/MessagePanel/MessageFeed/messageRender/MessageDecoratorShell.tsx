import type { FC, ReactNode } from 'react';

import type { MessageDecorator } from '@/store/diary/type';

import { useDiaryStore } from '@/store';

import { createInitialDraft } from '../../Composer/composer.types';
import DecoratedSurface from '../../DiaryInput/DecoratedSurface/DecoratedSurface';

export type MessageDecoratorShellProps = {
  messageId: string;
  decorators: MessageDecorator[];
  children: ReactNode;
};

const MessageDecoratorShell: FC<MessageDecoratorShellProps> = ({
  messageId,
  decorators,
  children,
}) => {
  const updateMessage = useDiaryStore('updateMessage');

  const updateDecorator = (index: number, decoration: MessageDecorator) => {
    updateMessage(messageId, {
      decorators: decorators.map((item, itemIndex) =>
        itemIndex === index ? decoration : item,
      ),
    });
  };

  const updateDraft = (
    updater: (
      draft: ReturnType<typeof createInitialDraft>,
    ) => ReturnType<typeof createInitialDraft>,
  ) => {
    const next = updater({
      ...createInitialDraft(),
      decorators,
    });

    if (next.decorators !== decorators) {
      updateMessage(messageId, { decorators: next.decorators });
    }
  };

  if (decorators.length === 0) {
    return <>{children}</>;
  }

  return (
    <DecoratedSurface
      draft={{ ...createInitialDraft(), decorators }}
      composing={false}
      updateDecorator={updateDecorator}
      updateDraft={updateDraft}
    >
      {children}
    </DecoratedSurface>
  );
};

export default MessageDecoratorShell;

import { useCallback, useRef } from 'react';

export const useMessageScroll = () => {
  const refs = useRef(new Map<string, HTMLElement>());
  const feedRef = useRef<HTMLDivElement | null>(null);

  const registerRef = useCallback(
    (messageId: string, element: HTMLElement | null) => {
      if (element) {
        refs.current.set(messageId, element);
        return;
      }

      refs.current.delete(messageId);
    },
    [],
  );

  const scrollToMessage = useCallback((messageId: string) => {
    const element = refs.current.get(messageId);

    if (!element) {
      return false;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.dataset.highlighted = 'true';
    window.setTimeout(() => {
      delete element.dataset.highlighted;
    }, 1500);

    return true;
  }, []);

  const scrollToBottom = useCallback(() => {
    const feed = feedRef.current;

    if (!feed) {
      return false;
    }

    // column-reverse: scrollTop 0 is the visual bottom
    feed.scrollTop = 0;
    return true;
  }, []);
  return {
    feedRef: feedRef,
    registerRef,
    scrollToMessage,
    scrollToBottom,
  };
};

export type MessageScrollAPI = ReturnType<typeof useMessageScroll>;

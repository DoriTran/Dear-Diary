import { useLayoutEffect, type RefObject } from 'react';

/**
 * Auto-grows a textarea to fit its content, optionally capped at `maxRows`.
 */
export const useAutoGrowTextarea = (
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxRows?: number,
) => {
  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const style = getComputedStyle(textarea);
    const lineHeight = parseFloat(style.lineHeight) || 20;
    const paddingY =
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const minHeight = lineHeight + paddingY;

    textarea.style.height = '0';
    const scrollHeight = textarea.scrollHeight;

    if (maxRows != null) {
      const maxHeight = lineHeight * maxRows + paddingY;
      const nextHeight = Math.min(
        Math.max(scrollHeight, minHeight),
        maxHeight,
      );

      textarea.style.height = `${nextHeight}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
      return;
    }

    textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    textarea.style.overflowY = 'hidden';
  }, [maxRows, textareaRef, value]);
};

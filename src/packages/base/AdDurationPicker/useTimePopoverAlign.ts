import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

type TimePopoverAlign = {
  containerRef: RefObject<HTMLDivElement | null>;
  crossAxisOffset: number;
};

export const useTimePopoverAlign = (
  enabled: boolean,
  deps: ReadonlyArray<unknown> = [],
): TimePopoverAlign => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [crossAxisOffset, setCrossAxisOffset] = useState(0);

  useLayoutEffect(() => {
    if (!enabled) {
      setCrossAxisOffset(0);
      return;
    }

    const measure = () => {
      const root = containerRef.current;
      if (!root) {
        return;
      }

      const fields = root.querySelector<HTMLElement>(
        '[class*="TimePicker-fieldsGroup"]',
      );

      const target =
        root.querySelector<HTMLElement>('[class*="Popover-target"]') ??
        root.querySelector<HTMLElement>('[class*="TimePicker-input"]') ??
        root.querySelector<HTMLElement>('[class*="Input-input"]') ??
        (root.firstElementChild as HTMLElement | null);

      if (!target || !fields) {
        setCrossAxisOffset(0);
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const fieldsRect = fields.getBoundingClientRect();
      const targetCenter = targetRect.left + targetRect.width / 2;
      const fieldsCenter = fieldsRect.left + fieldsRect.width / 2;

      setCrossAxisOffset(Math.round(fieldsCenter - targetCenter));
    };

    measure();

    const root = containerRef.current;
    if (!root) {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(root);

    const shell = root.closest('[class*="shell"]');
    if (shell instanceof HTMLElement) {
      observer.observe(shell);
    }

    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [enabled, ...deps]);

  return { containerRef, crossAxisOffset };
};

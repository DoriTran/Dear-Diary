import { useEffect, useState, type RefObject } from 'react';

import type { ScrollOffset } from './type';

/**
 * Track scroll offset of a scroll container element.
 * Pass the result to AdDragDrop `extraScrollOffset` for sortable scroll compensation.
 */
export default function useScrollOffset(
  ref: RefObject<HTMLElement | null>,
): ScrollOffset {
  const [scrollOffset, setScrollOffset] = useState<ScrollOffset>({
    scrollLeft: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const updateScrollOffset = () => {
      setScrollOffset({
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop,
      });
    };

    updateScrollOffset();

    element.addEventListener('scroll', updateScrollOffset, { passive: true });

    return () => {
      element.removeEventListener('scroll', updateScrollOffset);
    };
  }, [ref]);

  return scrollOffset;
}

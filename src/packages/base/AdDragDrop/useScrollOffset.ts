import { useEffect, useState, type RefObject } from 'react';

export interface ScrollOffset {
  scrollLeft: number;
  scrollTop: number;
}

/**
 * Get the scroll offset of an element.
 * Use for useSortable sortable prop in AdDragDrop.
 * Fill the extraScrollOffset prop in useSortable.
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

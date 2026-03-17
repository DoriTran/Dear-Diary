import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { useEffect, type RefObject } from 'react';

export interface AutoScrollOptions {
  ref?: RefObject<HTMLElement | null>;
  autoScroll?: boolean;
  autoScrollWindow?: boolean;
  allowedAxis?: 'horizontal' | 'vertical' | 'all';
}

export default function useAutoScroll(
  autoScroll: AutoScrollOptions = {},
): void {
  useEffect(() => {
    const el = autoScroll.ref?.current;

    if (!el || !autoScroll.autoScroll) return;

    return autoScrollForElements({
      element: el,
      getAllowedAxis: () => autoScroll.allowedAxis || 'all',
    });
  }, [autoScroll.ref, autoScroll.autoScroll, autoScroll.allowedAxis]);

  useEffect(() => {
    if (!autoScroll.autoScrollWindow) return;

    return autoScrollWindowForElements();
  }, [autoScroll.autoScrollWindow]);
}

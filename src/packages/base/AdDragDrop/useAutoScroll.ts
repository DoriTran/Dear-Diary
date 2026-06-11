import type { Input } from '@atlaskit/pragmatic-drag-and-drop/types';

import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { useEffect, type RefObject } from 'react';

/** Public auto-scroll configuration exposed by Atlaskit (`getConfiguration`). */
export type AutoScrollPublicConfig = {
  maxScrollSpeed?: 'standard' | 'fast';
};

export type AutoScrollElementFeedbackArgs = {
  input: Input;
  source: Record<string, unknown>;
  element: Element;
};

export type AutoScrollWindowFeedbackArgs = Omit<
  AutoScrollElementFeedbackArgs,
  'element'
>;

export type AllowedAxis = 'horizontal' | 'vertical' | 'all';

export interface AutoScrollOptions {
  ref?: RefObject<HTMLElement | null>;
  /** Scroll container override when it is not the AdDragDrop child element. */
  scrollRef?: RefObject<HTMLElement | null>;
  autoScroll?: boolean;
  autoScrollWindow?: boolean;
  allowedAxis?: AllowedAxis;
  canScroll?: (args: AutoScrollElementFeedbackArgs) => boolean;
  getConfiguration?: (
    args: AutoScrollElementFeedbackArgs,
  ) => AutoScrollPublicConfig;
  canScrollWindow?: (args: AutoScrollWindowFeedbackArgs) => boolean;
  getWindowConfiguration?: (
    args: AutoScrollWindowFeedbackArgs,
  ) => AutoScrollPublicConfig;
}

export default function useAutoScroll(options: AutoScrollOptions = {}): void {
  const {
    ref,
    scrollRef,
    autoScroll,
    autoScrollWindow,
    allowedAxis = 'all',
    canScroll,
    getConfiguration,
    canScrollWindow,
    getWindowConfiguration,
  } = options;

  useEffect(() => {
    const el = scrollRef?.current ?? ref?.current;

    if (!el || !autoScroll) return;

    return autoScrollForElements({
      element: el,
      ...(canScroll && { canScroll }),
      ...(getConfiguration && { getConfiguration }),
      getAllowedAxis: () => allowedAxis,
    });
  }, [ref, scrollRef, autoScroll, allowedAxis, canScroll, getConfiguration]);

  useEffect(() => {
    if (!autoScrollWindow) return;

    return autoScrollWindowForElements({
      ...(canScrollWindow && { canScroll: canScrollWindow }),
      ...(getWindowConfiguration && {
        getConfiguration: getWindowConfiguration,
      }),
      getAllowedAxis: () => allowedAxis,
    });
  }, [autoScrollWindow, allowedAxis, canScrollWindow, getWindowConfiguration]);
}

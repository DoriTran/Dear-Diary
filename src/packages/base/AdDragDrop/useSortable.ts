import { motion } from 'framer-motion';
import {
  createElement,
  useMemo,
  type ReactNode,
  type ReactElement,
  type RefObject,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';

import type {
  DragArgs,
  DragDropArgs,
  DragPreviewArgs,
  DragStartArgs,
  DropTargetChangeArgs,
} from './type';

import useMonitor from './useMonitor';

export interface UseSortableOptions<TData = unknown> {
  ref: RefObject<HTMLElement | null>;

  /** Enables sortable registration; overwrite drag preview behavior. */
  sortable?: boolean;

  /** Register this element as a sortable drag preview host (must be static element). */
  hostPreview?: boolean;

  /** Group identifier string for sortable group. */
  group?: string;

  /** Group identifier string that the item CURRENTLY belongs to. */
  itemOf?: string;

  /** Group ids the item may sort into. Use itemOf if not provided. */
  validGroups?: string[] | undefined;

  /** Drag into a different group. */
  onGroupChange?: (args: any) => void;

  /** Sortable item index changed. */
  onSortableIndexChange?: (args: any) => void;

  /** Extra scroll offset for sortable items. */
  extraScrollOffset?: { left: number; top: number };

  children: ReactElement;
  motions?: Record<string, unknown>;

  /** Optional: pass any drag data type. */
  data?: TData;
}

export interface UseSortableResult {
  motioned: ReactElement | null;
  sortableGroups: string;
}

export default function useSortable({
  ref,
  sortable,
  hostPreview,
  group,
  itemOf,
  validGroups,
  onGroupChange,
  onSortableIndexChange,
  extraScrollOffset,
  children,
  motions,
}: UseSortableOptions): UseSortableResult {
  const motionedTag = useMemo(
    () => (sortable ? motion.create(children.type) : null),
    [children.type, sortable],
  );

  const sortableGroups = useMemo(() => {
    if (!validGroups || validGroups.length === 0) {
      return itemOf ?? '';
    } else {
      return validGroups.join(',');
    }
  }, [validGroups, itemOf]);

  // #region Utility Functions
  /**
   * Only monitor items with the same sortable id as the container
   */
  const monitorAnyItemBelongsTo = (
    element: HTMLElement,
    targetGroup?: string,
  ) => {
    if (!targetGroup) return false;

    const rawGroups = element.getAttribute('data-sortable-groups');
    return rawGroups?.split(',').includes(targetGroup) ?? false;
  };

  const getMousePosition = (location: {
    current: { input: { pageX: number; pageY: number } };
  }): { pageX: number; pageY: number } => {
    const { pageX, pageY } = location.current.input;
    return { pageX, pageY };
  };

  const getSortableElements = (): Element[] => {
    return (
      Array.from(
        ref.current?.querySelectorAll(`[data-sortable-item-of='${itemOf}']`) ??
          [],
      ) ?? []
    );
  };

  const getCachedRects = (): Array<{
    top: number;
    left: number;
    right: number;
    bottom: number;
  }> => {
    const elRef = ref.current;
    if (!elRef) return [];

    const elements = getSortableElements();

    return elements.map((el) => {
      const rect = el.getBoundingClientRect();

      return {
        top: rect.top + elRef.scrollTop,
        left: rect.left + elRef.scrollLeft,
        right: rect.right + elRef.scrollLeft,
        bottom: rect.bottom + elRef.scrollTop,
      };
    });
  };

  const closestIndex = (): number => {
    const { pageX, pageY } = mouse.current;
    const { offsetX, offsetY, width, height } = window.sortable;
    const { scrollTop, scrollLeft } = ref.current;
    const originalCachedRects = cachedRects.current;

    // Calculate virtual drag box rect
    const virtualRect = {
      left: pageX - offsetX,
      top: pageY - offsetY,
      right: pageX - offsetX + width,
      bottom: pageY - offsetY + height,
    };

    // Shift scroll position from cached rects
    const adjustedRects = originalCachedRects.map((rect) => ({
      ...rect,
      top: rect.top - scrollTop - extraOffset.current.scrollTop,
      left: rect.left - scrollLeft - extraOffset.current.scrollLeft,
      right: rect.right - scrollLeft - extraOffset.current.scrollLeft,
      bottom: rect.bottom - scrollTop - extraOffset.current.scrollTop,
    }));

    // Helper function for corner calculation
    const getCornersFromRect = (r: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    }): {
      topLeft: { x: number; y: number };
      topRight: { x: number; y: number };
      bottomLeft: { x: number; y: number };
      bottomRight: { x: number; y: number };
    } => ({
      topLeft: { x: r.left, y: r.top },
      topRight: { x: r.right, y: r.top },
      bottomLeft: { x: r.left, y: r.bottom },
      bottomRight: { x: r.right, y: r.bottom },
    });

    // Helper function for distance calculation
    const distance = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
    ): number => {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    };

    const dragCorners = getCornersFromRect(virtualRect);
    let closestIndex = -1;
    let minDist = Infinity;

    adjustedRects.forEach((rect, i) => {
      const c = getCornersFromRect(rect);
      const totalDist =
        distance(dragCorners.topLeft, c.topLeft) +
        distance(dragCorners.topRight, c.topRight) +
        distance(dragCorners.bottomLeft, c.bottomLeft) +
        distance(dragCorners.bottomRight, c.bottomRight);

      if (totalDist < minDist) {
        minDist = totalDist;
        closestIndex = i;
      }
    });

    return closestIndex;
  };

  // #endregion

  // #region Sortable Host Preview
  const previewRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [previewClone, setPreviewClone] = useState<HTMLElement | null>(null);
  const previewCloneRef = useRef<HTMLElement | null>(null);
  const [style, setStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  useLayoutEffect(() => {
    if (!hostPreview) return;

    let disposed = false;

    if (!container || !previewRef.current) {
      previewCloneRef.current = null;
      queueMicrotask(() => {
        if (!disposed) setPreviewClone(null);
      });

      return () => {
        disposed = true;
      };
    }

    const cloned = previewRef.current.cloneNode(true) as HTMLElement;

    cloned.style.position = 'fixed';
    cloned.style.pointerEvents = 'none';
    cloned.style.zIndex = '2147483647';
    cloned.style.margin = '0';

    previewCloneRef.current = cloned;
    queueMicrotask(() => {
      if (!disposed) setPreviewClone(cloned);
    });

    return () => {
      disposed = true;
      previewCloneRef.current = null;
      queueMicrotask(() => setPreviewClone(null));
    };
  }, [container]);

  useLayoutEffect(() => {
    if (!hostPreview) return;

    if (!container || !previewClone) return;

    container.appendChild(previewClone);

    return () => {
      if (previewClone.parentNode === container) {
        container.removeChild(previewClone);
      }
    };
  }, [container, previewClone]);

  useLayoutEffect(() => {
    if (!hostPreview) return;

    const node = previewCloneRef.current;
    if (!node) return;

    node.style.width = `${style.width}px`;
    node.style.height = `${style.height}px`;
    node.style.left = `${style.left}px`;
    node.style.top = `${style.top}px`;
  }, [style]);

  useMonitor(
    {
      enabled: Boolean(sortable) && Boolean(hostPreview),
      canMonitor: ({ source }) =>
        monitorAnyItemBelongsTo(source.element, group),
      onDragStart: ({ source, location }: DragStartArgs) => {
        previewRef.current = source.element;

        const { pageX, pageY } = location.initial.input;

        setStyle((prev) => ({
          ...prev,
          left: pageX - offset.x,
          top: pageY - offset.y,
        }));

        const overlayContainer = document.createElement('div');

        overlayContainer.style.position = 'fixed';
        overlayContainer.style.zIndex = '2147483647';
        overlayContainer.style.pointerEvents = 'none';

        document.body.appendChild(overlayContainer);

        setContainer(overlayContainer);
      },
      onGenerateDragPreview: ({ location, source }: DragPreviewArgs) => {
        const rect = source.element.getBoundingClientRect();
        const { input } = location.current;

        setOffset({
          x: input.clientX - rect.x,
          y: input.clientY - rect.y,
        });

        setStyle((prev) => ({
          ...prev,
          width: rect.width,
          height: rect.height,
        }));
      },
      onDrag: ({ location }: DragArgs) => {
        setStyle((prev) => ({
          ...prev,
          left: location.current.input.pageX - offset.x,
          top: location.current.input.pageY - offset.y,
        }));
      },
      onDrop: () => {
        if (container) {
          document.body.removeChild(container);
        }

        previewCloneRef.current = null;
        setPreviewClone(null);
        setContainer(null);
        previewRef.current = null;
      },
    },
    [sortable, hostPreview, group, itemOf, validGroups],
  );
  // #endregion

  // #region Sortable Index Calculation
  const cachedRects = useRef<DOMRect[]>([]);

  useMonitor(
    {
      enabled: Boolean(sortable) && Boolean(group),
      canMonitor: ({ source }) =>
        monitorAnyItemBelongsTo(source.element, group),
      // onDragStart: ({ source, location }: DragStartArgs) => {
      //   console.log('onDragStart', group);
      // },
      // onDrag: ({ source, location }) => {
      //   console.log('onDrag', group);
      // },
      // onDrop: ({ source }) => {
      //   console.log('onDrop', group);
      // },
      // onTargetChange: ({ source, location }) => {
      //   console.log('onTargetChange', group);
      // },
      // onGenerateDragPreview: ({ source, location }) => {
      //   console.log('onGenerateDragPreview', group);
      // },
    },
    [
      ref,
      sortable,
      hostPreview,
      group,
      itemOf,
      onGroupChange,
      onSortableIndexChange,
      extraScrollOffset?.left,
      extraScrollOffset?.top,
      motions,
    ],
  );

  // #endregion

  return {
    motioned: sortable
      ? createElement(
          motionedTag!,
          {
            layout: true,
            transition: { type: 'spring', stiffness: 400, damping: 30 },
            ...(motions ?? {}),
          },
          (children.props as { children?: ReactNode }).children,
        )
      : null,
    sortableGroups,
  };
}

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

type SortableRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

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
      return itemOf ?? undefined;
    } else {
      return validGroups.join(',');
    }
  }, [validGroups, itemOf]);

  // #region Utility Functions
  /**
   * Only monitor items with the same sortable id as the container
   */
  const monitorGroupsHavingItemSorting = (
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
        ref.current?.querySelectorAll(`[data-sortable-item-of='${group}']`) ??
          [],
      ) ?? []
    );
  };

  const getCachedRects = (): SortableRect[] => {
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
  const previewSourceRef = useRef<HTMLElement | null>(null);
  const previewContainerRef = useRef<HTMLElement | null>(null);
  const previewCloneRef = useRef<HTMLElement | null>(null);

  const offsetRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });

  const cleanupPreview = () => {
    const clone = previewCloneRef.current;
    const container = previewContainerRef.current;

    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }

    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    previewCloneRef.current = null;
    previewContainerRef.current = null;
    previewSourceRef.current = null;
  };

  const stripDragDropAttributes = (root: HTMLElement) => {
    const targets = [
      root,
      ...Array.from(root.querySelectorAll<HTMLElement>('*')),
    ];

    targets.forEach((node) => {
      node.removeAttribute('draggable');
      node.removeAttribute('data-drop-target-for-element');
      node.removeAttribute('data-dragging');
      node.removeAttribute('data-sortable-item-of');
      node.removeAttribute('data-sortable-groups');
      node.removeAttribute('data-stop-drop-propagation');
    });
  };

  const updatePreviewPosition = (pageX: number, pageY: number) => {
    const node = previewCloneRef.current;
    if (!node) return;

    node.style.left = `${pageX - offsetRef.current.x}px`;
    node.style.top = `${pageY - offsetRef.current.y}px`;
  };

  useMonitor(
    {
      enabled: Boolean(sortable) && Boolean(hostPreview),
      canMonitor: ({ source }) =>
        monitorGroupsHavingItemSorting(source.element, group),

      onGenerateDragPreview: ({ location, source }: DragPreviewArgs) => {
        const rect = source.element.getBoundingClientRect();
        const { input } = location.current;

        previewSourceRef.current = source.element;

        offsetRef.current = {
          x: input.clientX - rect.left,
          y: input.clientY - rect.top,
        };

        sizeRef.current = {
          width: rect.width,
          height: rect.height,
        };
      },

      onDragStart: ({ source, location }: DragStartArgs) => {
        cleanupPreview();

        previewSourceRef.current = source.element;

        const overlayContainer = document.createElement('div');
        overlayContainer.style.position = 'fixed';
        overlayContainer.style.left = '0';
        overlayContainer.style.top = '0';
        overlayContainer.style.width = '0';
        overlayContainer.style.height = '0';
        overlayContainer.style.pointerEvents = 'none';
        overlayContainer.style.zIndex = '2147483647';

        const cloned = source.element.cloneNode(true) as HTMLElement;
        stripDragDropAttributes(cloned);

        cloned.style.position = 'fixed';
        cloned.style.pointerEvents = 'none';
        cloned.style.margin = '0';
        cloned.style.zIndex = '2147483647';
        cloned.style.boxSizing = 'border-box';
        cloned.style.width = `${sizeRef.current.width}px`;
        cloned.style.height = `${sizeRef.current.height}px`;

        overlayContainer.appendChild(cloned);
        document.body.appendChild(overlayContainer);

        previewContainerRef.current = overlayContainer;
        previewCloneRef.current = cloned;

        const { pageX, pageY } = location.initial.input;
        updatePreviewPosition(pageX, pageY);
      },

      onDrag: ({ location }: DragArgs) => {
        updatePreviewPosition(
          location.current.input.pageX,
          location.current.input.pageY,
        );
      },

      onDrop: () => {
        cleanupPreview();
      },
    },
    [sortable, hostPreview, group, itemOf, validGroups],
  );

  useLayoutEffect(() => {
    return () => {
      cleanupPreview();
    };
  }, []);

  // #region Sortable Index Calculation
  const cachedRects = useRef<SortableRect[]>([]);

  useMonitor(
    {
      enabled: Boolean(sortable) && Boolean(group),
      canMonitor: ({ source }) =>
        monitorGroupsHavingItemSorting(source.element, group),
      onDragStart: () => {
        cachedRects.current = getCachedRects();
        console.log(group, cachedRects.current);
      },
      // onDrag: ({ source, location }) => {
      //   console.log('onDrag', group);
      // },
      // onDrop: ({ source }) => {
      //   console.log('onDrop', group);
      // },
      onTargetChange: (data) => {
        console.log('onTargetChange', group, data);
      },
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

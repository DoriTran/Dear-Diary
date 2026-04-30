import type { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

import { motion } from 'framer-motion';
import {
  createElement,
  useMemo,
  type ReactNode,
  type ReactElement,
  type RefObject,
  useRef,
  useLayoutEffect,
} from 'react';

import type {
  DragArgs,
  DragPreviewArgs,
  DragStartArgs,
  ExtraScrollOffset,
  OnGroupChange,
  OnSortableChange,
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
  onGroupChange?: OnGroupChange;

  /** Sortable item index changed. */
  onSortableChange?: OnSortableChange;

  /** Extra scroll offset for sortable items. */
  extraScrollOffset?: ExtraScrollOffset;

  /** Motion duration in ms. Default is 400ms. */
  motionDuration?: number;

  children: ReactElement;
  motions?: Record<string, unknown>;

  /** Optional: pass any drag data type. */
  data?: TData;
}

export interface UseSortableResult {
  motioned: ReactElement | null;
  sortableGroups: string | undefined;
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
  onSortableChange,
  extraScrollOffset,
  motionDuration = 400,
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
  const logCachedRects = (
    rects: readonly SortableRect[] | null | undefined,
    label = group,
  ) => {
    if (!rects) {
      console.log(`${label}:`, rects);
      return;
    }

    const rows = rects.map((r) => ({
      top: Math.round(r.top),
      left: Math.round(r.left),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom),
      width: Math.round(r.right - r.left),
      height: Math.round(r.bottom - r.top),
    }));

    console.groupCollapsed(`${label} → (${rects.length}) items`);
    console.table(rows);
    console.groupEnd();
  };

  /**
   * Only monitor items with the same sortable id as the container
   */
  const monitorGroupsHavingItemSorting = (
    element: HTMLElement,
    targetGroup?: string,
  ) => {
    if (!targetGroup) return false;

    const rawGroups = element.getAttribute('data-sortable-valid-groups');
    return rawGroups?.split(',').includes(targetGroup) ?? false;
  };

  const isOwnerContainer = () => {
    return Boolean(
      ref.current?.querySelector(
        `[data-dragging][data-sortable-item-of="${group}"]`,
      ),
    );
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
    const { offsetX, offsetY, width, height } = offset.current;
    const { scrollTop, scrollLeft } = ref.current ?? {
      scrollTop: 0,
      scrollLeft: 0,
    };
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
      top: rect.top - scrollTop - (extraScrollOffset?.scrollTop ?? 0),
      left: rect.left - scrollLeft - (extraScrollOffset?.scrollLeft ?? 0),
      right: rect.right - scrollLeft - (extraScrollOffset?.scrollLeft ?? 0),
      bottom: rect.bottom - scrollTop - (extraScrollOffset?.scrollTop ?? 0),
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
      node.removeAttribute('data-sortable-valid-groups');
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
  // #endregion

  // #region Sortable Index Calculation
  const cachedRects = useRef<SortableRect[]>([]);
  const mouse = useRef({ pageX: 0, pageY: 0 });
  const offset = useRef({ offsetX: 0, offsetY: 0, width: 0, height: 0 });
  const index = useRef({ current: -1, previous: -1 });
  const sorting = useRef(false); // This container hold & sort the item being dragged

  useMonitor(
    {
      enabled: Boolean(sortable) && Boolean(group),
      canMonitor: ({ source }) =>
        monitorGroupsHavingItemSorting(source.element, group),
      onDragStart: ({ source, location }) => {
        // Cached all rects inside this container
        cachedRects.current = getCachedRects();
        logCachedRects(cachedRects.current);

        // Init mouse position
        mouse.current = getMousePosition(location);

        // Init target sortable rect offset
        const rect = source.element.getBoundingClientRect();
        offset.current = {
          offsetX: mouse.current.pageX - rect.left + scrollX,
          offsetY: mouse.current.pageY - rect.top + scrollY,
          width: rect.width,
          height: rect.height,
        };

        // Init start index
        const elements = getSortableElements();
        const targetIndex = elements.findIndex((el) => el === source.element);
        index.current = {
          current: targetIndex,
          previous: -1,
        };

        // Init sorting status
        sorting.current =
          source.element.getAttribute('data-sortable-item-of') === group &&
          elements.includes(source.element);
      },
      onDrag: ({ source, location }) => {
        // Early return if outside logic is not implemented
        if (!onSortableChange) return;

        // Early return for container not contain sorting item
        const sorting = isOwnerContainer();
        if (!sorting) return;

        // Early return if position not change
        const { pageX, pageY } = getMousePosition(location);
        if (pageX !== mouse.current.pageX || pageY !== mouse.current.pageY) {
          mouse.current = { pageX, pageY };
        } else return;

        // Early return if dragging element or container not found for any reason
        const draggingElement = source.element as HTMLElement | null;
        if (!draggingElement || !ref.current) return;

        // Early return if cached rects not initialized
        if (!cachedRects.current) return;

        /**
         * Dragging logic
         */
        const closestIdx = closestIndex();
        if (closestIdx !== -1 && closestIdx !== index.current.current) {
          index.current = {
            current: closestIdx,
            previous: index.current.current,
          };

          // Call the onSortableChange callback
          const didSortableChange = onSortableChange(index.current);

          // Update cached rects if outside sortable index changed or result not returned
          if (didSortableChange === true || didSortableChange === undefined) {
            const newCachedRects = [...cachedRects.current];
            [
              newCachedRects[index.current.current],
              newCachedRects[index.current.previous],
            ] = [
              newCachedRects[index.current.previous],
              newCachedRects[index.current.current],
            ];
          }
        }
      },
      onTargetChange: ({ data, source, location }) => {
        const id = ref.current?.getAttribute('data-test-id');
        // Early return if outside logic is not implemented
        if (!onGroupChange) return;

        // Filter out drop targets have group id that are not in the valid groups of item
        const validGroups =
          source.element
            .getAttribute('data-sortable-valid-groups')
            ?.split(',') ?? [];
        const dropTargets = location.current.dropTargets.filter(
          (target: DropTargetRecord) => {
            const groupId = target.element.getAttribute('data-sortable-group');
            return (
              groupId !== undefined &&
              groupId !== null &&
              validGroups.includes(groupId)
            );
          },
        );

        // console.log(location.current.dropTargets);
        // console.log('dropTargets', dropTargets);

        // Early return if no drop targets
        if (dropTargets.length === 0) return;

        // Early return if item not change group container but target change event triggered
        const topDropTarget = dropTargets[0];
        if (ref.current === topDropTarget?.element && sorting.current) return;
        sorting.current = ref.current === topDropTarget?.element;

        // Check if item is entering this container
        const entering = ref.current === topDropTarget?.element;
        if (entering) {
          const closestIdx = closestIndex();
          index.current = { current: closestIdx, previous: -1 };
          console.log(id, 'entering', closestIdx);
          const didGroupChange = onGroupChange?.({
            type: 'enter',
            itemData: data,
            index: closestIdx,
          });

          // Update cached rects if outside group changed or result not returned
          if (didGroupChange === true || didGroupChange === undefined) {
            setTimeout(() => {
              cachedRects.current = getCachedRects();
            }, motionDuration);
          }

          return;
        }

        // Check if item is leaving this container
        const leaving = isOwnerContainer(); //?
        if (leaving) {
          console.log(id, 'leaving');
          // console.log(`[${group}]`, 'onGroupChange leave', { itemData: data });
          const didGroupChange = onGroupChange?.({
            type: 'leave',
            itemData: data,
          });

          // Update cached rects if outside group changed or result not returned
          if (didGroupChange === true || didGroupChange === undefined) {
            setTimeout(() => {
              cachedRects.current = getCachedRects();
            }, motionDuration);
          }

          return;
        }
      },
      onDrop: () => {
        // Reset the mouse, offset, index, and sorting refs to their default states after dropping
        mouse.current = { pageX: 0, pageY: 0 };
        offset.current = { offsetX: 0, offsetY: 0, width: 0, height: 0 };
        index.current = { current: -1, previous: -1 };
        sorting.current = false;
      },
    },
    [
      ref,
      sortable,
      hostPreview,
      group,
      itemOf,
      onGroupChange,
      onSortableChange,
      extraScrollOffset?.scrollLeft,
      extraScrollOffset?.scrollTop,
      motionDuration,
      motions,
    ],
  );

  // #endregion

  return {
    motioned: sortable
      ? createElement(
          motionedTag!,
          {
            ...(children.props as Record<string, unknown>),
            layout: true,
            transition: {
              type: 'spring',
              duration: motionDuration / 1000,
              bounce: 0.25,
            },
            ...(motions ?? {}),
          },
          (children.props as { children?: ReactNode }).children,
        )
      : null,
    sortableGroups,
  };
}

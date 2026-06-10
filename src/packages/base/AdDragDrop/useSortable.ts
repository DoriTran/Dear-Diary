import type { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

import { motion } from 'framer-motion';
import {
  createElement,
  useMemo,
  type ReactNode,
  type ReactElement,
  type RefObject,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import type {
  DragArgs,
  DragPreviewArgs,
  DragStartArgs,
  ScrollOffset,
  OnGroupChange,
  OnSortableChange,
  SortableDirection,
  SortableStrategy,
} from './type';
import type { UseDraggingOptions } from './useDragging';

import useMonitor, { type WithData } from './useMonitor';

export interface UseSortableOptions {
  ref: RefObject<HTMLElement | null>;

  /** Enables sortable registration; overwrite drag preview behavior. */
  sortable?: boolean;

  /** Register this element as a sortable drag preview host (must be static element). */
  hostPreview?: boolean;

  /** Same as `useDragging` `data` (static payload or `getInitialData` callback). */
  data?: UseDraggingOptions['data'];

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

  /** Motion duration in ms. Default is 400ms. */
  motionDuration?: number;

  /** Sortable list layout direction. Default `vertical`. */
  direction?: SortableDirection;

  /** Closest index calculation strategy. Default `center`. */
  strategy?: SortableStrategy;

  children: ReactElement;
  motions?: Record<string, unknown>;
}

export interface UseSortableResult {
  motioned: ReactElement | null;
  sortableGroups: string | undefined;
  sorting: boolean | undefined;
}

type SortableRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

type MouseMoveDirection = 'up' | 'down' | 'left' | 'right' | 'none';

type MousePosition = {
  pageX: number;
  pageY: number;
  direction: MouseMoveDirection;
};

type MouseState = {
  current: MousePosition;
  previous: MousePosition;
};

const DEFAULT_MOUSE_POSITION: MousePosition = {
  pageX: 0,
  pageY: 0,
  direction: 'none',
};

const DEFAULT_MOUSE_STATE: MouseState = {
  current: { ...DEFAULT_MOUSE_POSITION },
  previous: { ...DEFAULT_MOUSE_POSITION },
};

export default function useSortable({
  ref,
  sortable,
  hostPreview,
  data,
  group,
  itemOf,
  validGroups,
  onGroupChange,
  onSortableChange,
  motionDuration = 400,
  direction = 'vertical',
  strategy = 'vertex',
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

  const initialScrollOffset = useRef<ScrollOffset>({
    scrollLeft: 0,
    scrollTop: 0,
  });
  const extraScrollOffsetRef = useRef<ScrollOffset>({
    scrollLeft: 0,
    scrollTop: 0,
  });

  // #region Utility Functions
  const logCachedRects = (
    rects: readonly SortableRect[] | null | undefined,
    label = group,
  ) => {
    if (!rects) {
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

  // Only monitor items with the same sortable id as the container
  const monitorGroupsHavingItemSorting = (
    element: HTMLElement,
    targetGroup?: string,
  ) => {
    if (!targetGroup) return false;

    const rawGroups = element.getAttribute('data-sortable-valid-groups');
    return rawGroups?.split(',').includes(targetGroup) ?? false;
  };

  // Swap cached rects by its size and position
  const swapCachedRect = (
    rects: SortableRect[],
    first: number,
    second: number,
  ): SortableRect[] => {
    if (
      first === second ||
      first < 0 ||
      second < 0 ||
      first >= rects.length ||
      second >= rects.length
    ) {
      return rects;
    }

    if (first > second) {
      return swapCachedRect(rects, second, first);
    }

    const result = rects.map((rect) => ({ ...rect }));

    const firstRect = rects[first];
    const secondRect = rects[second];

    if (direction === 'vertical') {
      const sizes = result.map((rect) => rect.height);

      sizes[first] = secondRect.height;
      sizes[second] = firstRect.height;

      for (let i = first; i <= second; i++) {
        const previousRect = result[i - 1];
        const originalRect = rects[i];

        const gap = i === first ? 0 : originalRect.top - rects[i - 1].bottom;

        const top = i === first ? firstRect.top : previousRect.bottom + gap;

        result[i] = {
          ...originalRect,
          height: sizes[i],
          top,
          bottom: top + sizes[i],
        };
      }
    }

    if (direction === 'horizontal') {
      const sizes = result.map((rect) => rect.width);

      sizes[first] = secondRect.width;
      sizes[second] = firstRect.width;

      for (let i = first; i <= second; i++) {
        const previousRect = result[i - 1];
        const originalRect = rects[i];

        const gap = i === first ? 0 : originalRect.left - rects[i - 1].right;

        const left = i === first ? firstRect.left : previousRect.right + gap;

        result[i] = {
          ...originalRect,
          width: sizes[i],
          left,
          right: left + sizes[i],
        };
      }
    }

    return result;
  };

  const getMousePosition = (location: {
    current: { input: { pageX: number; pageY: number } };
  }): { pageX: number; pageY: number } => {
    const { pageX, pageY } = location.current.input;
    return { pageX, pageY };
  };

  const calculateMouseState = (
    state: MouseState,
    pageX: number,
    pageY: number,
    options?: { resetPrevious?: boolean },
  ): MouseState => {
    if (options?.resetPrevious) {
      const position: MousePosition = {
        pageX,
        pageY,
        direction: 'none',
      };
      return { current: position, previous: { ...position } };
    }

    const from = state.current;
    const dx = pageX - from.pageX;
    const dy = pageY - from.pageY;

    let moveDirection = from.direction;
    if (direction === 'vertical') {
      if (dy > 0) moveDirection = 'down';
      else if (dy < 0) moveDirection = 'up';
    } else if (direction === 'horizontal') {
      if (dx > 0) moveDirection = 'right';
      else if (dx < 0) moveDirection = 'left';
    }

    return {
      previous: from,
      current: { pageX, pageY, direction: moveDirection },
    };
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
        width: rect.width,
        height: rect.height,
      };
    });
  };

  const insertTemplateToCachedRects = (insertIndex: number) => {
    // If container empty, early return
    if (cachedRects.current.length === 0) return;

    const { virtualRect } = calculateRect();
    const rects = cachedRects.current;

    const safeIndex = Math.max(0, Math.min(insertIndex, rects.length));
    const firstRect = rects[0];

    const gap =
      rects.length >= 2
        ? direction === 'vertical'
          ? rects[1].top - rects[0].bottom
          : rects[1].left - rects[0].right
        : 0;

    const template: SortableRect =
      direction === 'vertical'
        ? {
            left: firstRect.left,
            right: firstRect.right,
            width: firstRect.width,
            height: virtualRect.height,
            top: 0,
            bottom: 0,
          }
        : {
            top: firstRect.top,
            bottom: firstRect.bottom,
            height: firstRect.height,
            width: virtualRect.width,
            left: 0,
            right: 0,
          };

    const nextRects = [
      ...rects.slice(0, safeIndex),
      template,
      ...rects.slice(safeIndex),
    ];

    if (direction === 'vertical') {
      let top =
        safeIndex === 0 ? firstRect.top : nextRects[safeIndex - 1].bottom + gap;

      for (let i = safeIndex; i < nextRects.length; i++) {
        const height = nextRects[i].height;

        nextRects[i] = {
          ...nextRects[i],
          top,
          bottom: top + height,
        };

        top = nextRects[i].bottom + gap;
      }
    }

    if (direction === 'horizontal') {
      let left =
        safeIndex === 0 ? firstRect.left : nextRects[safeIndex - 1].right + gap;

      for (let i = safeIndex; i < nextRects.length; i++) {
        const width = nextRects[i].width;

        nextRects[i] = {
          ...nextRects[i],
          left,
          right: left + width,
        };

        left = nextRects[i].right + gap;
      }
    }

    cachedRects.current = nextRects;
  };

  const removeRectFromCachedRects = (removeIndex: number) => {
    const rects = cachedRects.current;
    if (removeIndex < 0 || removeIndex >= rects.length) return;

    const gap =
      rects.length >= 2
        ? direction === 'vertical'
          ? rects[1].top - rects[0].bottom
          : rects[1].left - rects[0].right
        : 0;

    const nextRects = [
      ...rects.slice(0, removeIndex),
      ...rects.slice(removeIndex + 1),
    ];

    if (nextRects.length === 0) {
      cachedRects.current = nextRects;
      return;
    }

    if (direction === 'vertical') {
      let top =
        removeIndex === 0
          ? rects[0].top
          : nextRects[removeIndex - 1].bottom + gap;

      for (let i = removeIndex; i < nextRects.length; i++) {
        const height = nextRects[i].height;
        nextRects[i] = {
          ...nextRects[i],
          top,
          bottom: top + height,
        };
        top = nextRects[i].bottom + gap;
      }
    }

    if (direction === 'horizontal') {
      let left =
        removeIndex === 0
          ? rects[0].left
          : nextRects[removeIndex - 1].right + gap;

      for (let i = removeIndex; i < nextRects.length; i++) {
        const width = nextRects[i].width;
        nextRects[i] = {
          ...nextRects[i],
          left,
          right: left + width,
        };
        left = nextRects[i].right + gap;
      }
    }

    cachedRects.current = nextRects;
  };

  const calculateRect = () => {
    const { pageX, pageY } = mouse.current.current;
    const { offsetX, offsetY, width, height } = offset.current;
    const { scrollTop, scrollLeft } = ref.current ?? {
      scrollTop: 0,
      scrollLeft: 0,
    };

    const extraTop =
      extraScrollOffsetRef.current.scrollTop -
      initialScrollOffset.current.scrollTop;
    const extraLeft =
      extraScrollOffsetRef.current.scrollLeft -
      initialScrollOffset.current.scrollLeft;

    console.log(extraScrollOffsetRef.current);

    const virtualRect = {
      left: pageX - offsetX,
      top: pageY - offsetY,
      right: pageX - offsetX + width,
      bottom: pageY - offsetY + height,
      width: width,
      height: height,
    };

    const adjustedRects = cachedRects.current.map((rect) => ({
      ...rect,
      top: rect.top - scrollTop - extraTop,
      left: rect.left - scrollLeft - extraLeft,
      right: rect.right - scrollLeft - extraLeft,
      bottom: rect.bottom - scrollTop - extraTop,
    }));

    return { virtualRect, adjustedRects };
  };

  const closestIndex = (): number => {
    const { virtualRect, adjustedRects } = calculateRect();

    type Point = { x: number; y: number };
    type RectLike = {
      left: number;
      top: number;
      right: number;
      bottom: number;
    };

    const squaredDistance = (p1: Point, p2: Point): number => {
      return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    };

    // #region Center Strategy
    const closestByCenter = (): number => {
      const getCenterFromRect = (rect: RectLike): Point => ({
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2,
      });

      const dragCenter = getCenterFromRect(virtualRect);

      let closestIndex = -1;
      let minDistance = Infinity;

      adjustedRects.forEach((rect, i) => {
        const rectCenter = getCenterFromRect(rect);
        const distance = squaredDistance(dragCenter, rectCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });

      return closestIndex;
    };
    // #endregion

    // #region Vertex Strategy
    const closestByVertex = (): number => {
      const getCornersFromRect = (rect: RectLike) => ({
        topLeft: { x: rect.left, y: rect.top },
        topRight: { x: rect.right, y: rect.top },
        bottomLeft: { x: rect.left, y: rect.bottom },
        bottomRight: { x: rect.right, y: rect.bottom },
      });

      const dragCorners = getCornersFromRect(virtualRect);

      let closestIndex = -1;
      let minDistance = Infinity;

      adjustedRects.forEach((rect, i) => {
        const corners = getCornersFromRect(rect);
        const totalDistance =
          squaredDistance(dragCorners.topLeft, corners.topLeft) +
          squaredDistance(dragCorners.topRight, corners.topRight) +
          squaredDistance(dragCorners.bottomLeft, corners.bottomLeft) +
          squaredDistance(dragCorners.bottomRight, corners.bottomRight);

        if (totalDistance < minDistance) {
          minDistance = totalDistance;
          closestIndex = i;
        }
      });

      return closestIndex;
    };
    // #endregion

    // #region Side Strategy
    const closestBySide = (): number => {
      let closestIndex = -1;
      let maxCoveredPercent = -1;

      adjustedRects.forEach((rect, i) => {
        const rectSize =
          direction === 'vertical'
            ? rect.bottom - rect.top
            : rect.right - rect.left;

        if (rectSize <= 0) return;

        const coveredSize =
          direction === 'vertical'
            ? Math.max(
                0,
                Math.min(virtualRect.bottom, rect.bottom) -
                  Math.max(virtualRect.top, rect.top),
              )
            : Math.max(
                0,
                Math.min(virtualRect.right, rect.right) -
                  Math.max(virtualRect.left, rect.left),
              );

        const coveredPercent = coveredSize / rectSize;

        if (coveredPercent > maxCoveredPercent) {
          maxCoveredPercent = coveredPercent;
          closestIndex = i;
        }
      });

      return closestIndex;
    };
    // #endregion

    switch (strategy) {
      case 'vertex':
        return closestByVertex();
      case 'side':
        return closestBySide();
      case 'center':
      default:
        return closestByCenter();
    }
  };

  const insertIndex = (closestIdx: number) => {
    const { virtualRect, adjustedRects } = calculateRect();
    const closestRect = adjustedRects[closestIdx];

    if (!closestRect) return closestIdx;

    if (direction === 'vertical') {
      const virtualCenter = (virtualRect.top + virtualRect.bottom) / 2;
      const closestCenter = (closestRect.top + closestRect.bottom) / 2;

      return virtualCenter > closestCenter ? closestIdx + 1 : closestIdx;
    }

    if (direction === 'horizontal') {
      const virtualCenter = (virtualRect.left + virtualRect.right) / 2;
      const closestCenter = (closestRect.left + closestRect.right) / 2;

      return virtualCenter > closestCenter ? closestIdx + 1 : closestIdx;
    }

    return closestIdx;
  };
  // #endregion

  // #region Sortable Scroll Offset
  const getGroupScrollers = (): HTMLElement[] =>
    Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroller]'),
    ).filter((el) => el.getAttribute('data-scroller') === group);

  const getGroupScrollOffset = (): ScrollOffset => {
    const scrollers = getGroupScrollers();

    return {
      scrollLeft: scrollers.reduce((sum, el) => sum + el.scrollLeft, 0),
      scrollTop: scrollers.reduce((sum, el) => sum + el.scrollTop, 0),
    };
  };

  useEffect(() => {
    if (!sortable || !group) return;

    const updateExtraScrollOffset = () => {
      extraScrollOffsetRef.current = getGroupScrollOffset();
    };

    updateExtraScrollOffset();

    const scrollers = getGroupScrollers();
    const listenerOptions: AddEventListenerOptions = { passive: true };

    scrollers.forEach((el) => {
      el.addEventListener('scroll', updateExtraScrollOffset, listenerOptions);
    });

    return () => {
      scrollers.forEach((el) => {
        el.removeEventListener('scroll', updateExtraScrollOffset);
      });
    };
  }, [sortable, group]);

  useMonitor({
    enabled: Boolean(sortable) && Boolean(group),
    canMonitor: () => Boolean(sortable) && Boolean(group),
    onDragStart: () => {
      initialScrollOffset.current = getGroupScrollOffset();
    },
  });
  // #endregion

  // #region Sortable Item status
  const [sorting, setSorting] = useState<boolean | undefined>(undefined);

  useMonitor(
    {
      // Enable and monitor all sortable items
      enabled: Boolean(sortable) && Boolean(itemOf),
      canMonitor: () => Boolean(sortable) && Boolean(itemOf),
      onDrag: (args: WithData<DragArgs>) => {
        if (sorting !== undefined) return;

        const { source, location } = args;

        if (typeof data === 'function') {
          const local = data({
            element: source.element,
            input: location.initial.input,
            dragHandle:
              (source as { dragHandle?: HTMLElement | null }).dragHandle ??
              null,
          });
          setSorting(local.id === source.data?.id);
        } else {
          setSorting(data?.id === source.data?.id);
        }
      },
      onDrop: () => {
        setSorting(undefined);
      },
    },
    [sortable, itemOf, data],
  );
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
  const mouse = useRef<MouseState>(DEFAULT_MOUSE_STATE);
  const offset = useRef({ offsetX: 0, offsetY: 0, width: 0, height: 0 });
  const index = useRef({ current: -1, previous: -1 });
  const holding = useRef(false); // This container holds & sorts the item being dragged

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
        const { pageX, pageY } = getMousePosition(location);
        mouse.current = calculateMouseState(mouse.current, pageX, pageY, {
          resetPrevious: true,
        });

        // Init target sortable rect offset
        const rect = source.element.getBoundingClientRect();
        offset.current = {
          offsetX: mouse.current.current.pageX - rect.left + scrollX,
          offsetY: mouse.current.current.pageY - rect.top + scrollY,
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

        holding.current =
          source.element.getAttribute('data-sortable-item-of') === group &&
          elements.includes(source.element);
      },
      onDrag: ({ source, location }) => {
        // Early return if outside logic is not implemented
        if (!onSortableChange) return;

        // Early return for container not holding the dragged item
        if (!holding.current) return;

        // Early return if position not change
        const { pageX, pageY } = getMousePosition(location);
        const { pageX: currentX, pageY: currentY } = mouse.current.current;
        if (pageX !== currentX || pageY !== currentY) {
          mouse.current = calculateMouseState(mouse.current, pageX, pageY);
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
        const newIndex = {
          current: closestIdx,
          previous: index.current.current,
        };

        if (closestIdx !== -1 && closestIdx !== index.current.current) {
          // Check if it bouncing between the same two indexes while direction not changed
          switch (mouse.current.current.direction) {
            case 'up':
            case 'left':
              if (newIndex.current > newIndex.previous) return;
              else break;
            case 'down':
            case 'right':
              if (newIndex.current < newIndex.previous) return;
              else break;

            case 'none':
              break;
          }

          // Call the onSortableChange callback
          const didSortableChange = onSortableChange(newIndex);

          // Update cached rects if outside sortable index changed or result not returned
          if (didSortableChange === true || didSortableChange === undefined) {
            index.current = newIndex;

            cachedRects.current = swapCachedRect(
              cachedRects.current,
              index.current.previous,
              index.current.current,
            );
            logCachedRects(cachedRects.current);
          }
        }
      },
      onTargetChange: ({ data, source, location }) => {
        // Early return if outside logic is not implemented
        if (!onGroupChange) return;

        // Early return if no valid drop targets
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
        if (dropTargets.length === 0) return;

        // Early return if item not change group container but target change event triggered
        const topDropTarget = dropTargets[0];
        if (ref.current === topDropTarget?.element && holding.current) return;

        /**
         * Group change logic
         */

        const isEntering = ref.current === topDropTarget?.element;
        const isLeaving = holding.current;
        holding.current = isEntering;

        // [Enter] Check if item is entering this container
        if (isEntering) {
          // Find closest index to the mouse position
          const { pageX, pageY } = getMousePosition(location);
          mouse.current = calculateMouseState(mouse.current, pageX, pageY);
          const closestIdx = closestIndex();
          const insertIdx = insertIndex(closestIdx);
          const didGroupChange = onGroupChange?.({
            type: 'enter',
            index: insertIdx,
            data,
          });

          // Update cached rects if outside group changed or result not returned
          if (didGroupChange === true || didGroupChange === undefined) {
            index.current = { current: insertIdx, previous: -1 };
            insertTemplateToCachedRects(insertIdx);
          }

          return;
        }

        // [Leave] Check if item is leaving this container
        if (isLeaving) {
          const leaveIndex = index.current.current;
          const didGroupChange = onGroupChange?.({
            type: 'leave',
            index: leaveIndex,
            data,
          });

          // Update cached rects if outside group changed or result not returned
          if (didGroupChange === true || didGroupChange === undefined) {
            removeRectFromCachedRects(leaveIndex);
          }

          return;
        }
      },
      onDrop: () => {
        // Reset the mouse, offset, index, and holding refs to their default states after dropping
        mouse.current = DEFAULT_MOUSE_STATE;
        offset.current = { offsetX: 0, offsetY: 0, width: 0, height: 0 };
        index.current = { current: -1, previous: -1 };
        holding.current = false;
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
      motionDuration,
      direction,
      strategy,
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
    sorting,
  };
}

import clsx from 'clsx';
import {
  Children,
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type FC,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';

import type { AdDragDropProps } from './type';

import useAutoScroll from './useAutoScroll';
import useDragging, { type UseDraggingResult } from './useDragging';
import useDropping, { type UseDroppingResult } from './useDropping';
import useScrollOffset from './useScrollOffset';
import useSortable from './useSortable';

export type { AdDragDropProps, DragClassName, DragStyle } from './type';

/**
 * Custom data properties:
 * → data-handle: Boolean; whether the element is a handle
 */

const AdDragDrop: FC<AdDragDropProps> = (props) => {
  const {
    /* Dragging options */
    draggable = false,
    data,
    canDrag,
    onDragStart,
    onDrag,
    onDrop,
    onTargetChange,
    onGenerateOverlay,
    dragDeps = [],
    native,
    overlay,
    drag,

    /* Dropping options */
    droppable = false,
    dropData,
    canDrop,
    onCatch,
    onDragEnter,
    onDragLeave,
    cursorEffect,
    stopDropPropagation,
    sticky,
    dropDeps = [],
    drop,

    /* Sortable options */
    sortable = false,
    hostPreview = false,
    motionDuration = 400,
    alwaysBouncy = false,
    direction = 'vertical',
    strategy = 'vertex',
    group,
    itemOf,
    validGroups,
    onGroupChange,
    onSortableChange,
    extraScrollOffset,

    /* Auto scroll options */
    autoScroll,
    autoScrollWindow,
    scrollRef,
    allowedAxis = 'all',
    canScroll,
    getConfiguration,
    canScrollWindow,
    getWindowConfiguration,

    /* Log Debug Options */
    logEvents = [],

    /* Other Options */
    style = {},
    className = '',

    showOrigin,

    children,
  } = props;

  const ref = useRef<HTMLElement | null>(null);
  const handle = useRef<HTMLElement | null>(null);
  const trackedScrollOffset = useScrollOffset(scrollRef ?? { current: null });
  const resolvedExtraScrollOffset =
    extraScrollOffset ??
    (scrollRef ? trackedScrollOffset : { scrollLeft: 0, scrollTop: 0 });

  const {
    draggable: isDraggable,
    dragging,
    container,
    dragStyle,
  }: UseDraggingResult = useDragging(
    {
      ref,
      handle,
      data,
      canDrag,
      onDragStart,
      onDrag,
      onDrop,
      onTargetChange,
      onGenerateOverlay,
      native,
      overlay: !!overlay,
      sortable,
      logEvents,
      ...drag,
      draggable,
    },
    dragDeps,
  );

  const { droppable: isDroppable, hovering }: UseDroppingResult = useDropping(
    {
      ref,
      data: dropData,
      canDrop,
      onCatch,
      onDragEnter,
      onDragLeave,
      cursorEffect,
      stopDropPropagation,
      sticky,
      logEvents,
      ...drop,
      droppable,
    },
    dropDeps,
  );

  useAutoScroll({
    ref,
    scrollRef,
    autoScroll: autoScroll && isDroppable,
    autoScrollWindow,
    allowedAxis,
    canScroll,
    getConfiguration,
    canScrollWindow,
    getWindowConfiguration,
  });

  const { motioned, sortableGroups, sorting } = useSortable({
    ref,
    sortable,
    data,
    hostPreview,
    motionDuration,
    alwaysBouncy,
    direction,
    strategy,
    group,
    itemOf,
    validGroups,
    onGroupChange,
    onSortableChange,
    extraScrollOffset: resolvedExtraScrollOffset,
    children,
  });

  useLayoutEffect(() => {
    if (scrollRef) {
      scrollRef.current = ref.current;
    }

    if (!ref.current || !draggable) {
      handle.current = null;
      return;
    }

    handle.current =
      ref.current.querySelector<HTMLElement>('[data-handle]') ?? null;
  });

  useEffect(() => {
    if (!handle.current || !ref.current) return;
    handle.current.style.cursor = dragging ? 'grabbing' : 'grab';
    ref.current.style.cursor = '';
  }, [dragging]);

  if (Children.count(children) > 1) {
    console.warn('[AdDragDrop] AdDragDrop expects exactly one child element.');

    return children;
  }

  const classNames =
    typeof className === 'string'
      ? {
          base: className,
          hover: '',
          overlay: '',
        }
      : className;

  const renderedChild: ReactElement =
    sortable && motioned ? motioned : children;

  return (
    <>
      {cloneElement(renderedChild, {
        ref,
        // If drop event callback should not bubbled up to the parent.
        'data-stop-drop-propagation': stopDropPropagation ? true : undefined,
        // If the item is sorting.
        'data-sorting': sorting,
        // In sortable, use for container, indicate group id.
        'data-sortable-group': sortable ? group : undefined,
        // In sortable, use for item, indicate current group that item belongs to.
        'data-sortable-item-of': sortable ? itemOf : undefined,
        // In sortable, use for item, indicate all groups that item can be sorted into.
        'data-sortable-valid-groups': sortable ? sortableGroups : undefined,
        // Custom styling
        style: {
          ...(children.props as { style?: CSSProperties }).style,
          ...(dragging && style.base),
          ...(hovering && style.hover),
          ...(isDraggable && {
            opacity: !showOrigin && (dragging || sorting) ? 0 : 1,
            cursor: dragging ? 'grabbing' : 'grab',
          }),
        } as CSSProperties,
        className: clsx(
          (children.props as { className?: string }).className,
          dragging && classNames?.base,
          hovering && classNames?.hover,
        ),
      } as any)}

      {container &&
        !sortable &&
        createPortal(
          overlay ||
            cloneElement(children, {
              style: {
                ...(children.props as { style?: CSSProperties }).style,
                ...style.overlay,
                ...(!native && dragStyle),
              } as CSSProperties,
              className: clsx(
                (children.props as { className?: string }).className,
                classNames?.overlay,
              ),
            } as any),
          container,
        )}
    </>
  );
};

export default AdDragDrop;

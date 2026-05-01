import clsx from 'clsx';
import {
  Children,
  cloneElement,
  useEffect,
  useRef,
  type CSSProperties,
  type FC,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';

import type { AdDragDropProps, DragClassName, DragStyle } from './type';

import useAutoScroll from './useAutoScroll';
import useDragging, { type UseDraggingResult } from './useDragging';
import useDropping, { type UseDroppingResult } from './useDropping';
import useSortable from './useSortable';

export type { AdDragDropProps, DragClassName, DragStyle };

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
    group,
    itemOf,
    validGroups,
    onGroupChange,
    onSortableChange,
    extraScrollOffset = { scrollLeft: 0, scrollTop: 0 },

    /* Auto scroll options */
    autoScroll,
    autoScrollWindow,
    horizontal, // Whether to auto scroll horizontally.
    vertical, // Whether to auto scroll vertically.

    /* Log Debug Options */
    logEvents = [],

    /* Other Options */
    style = {},
    className = '',

    showOrigin,

    children,
  } = props as AdDragDropProps & {
    horizontal?: boolean;
    vertical?: boolean;
  };

  const ref = useRef<HTMLElement | null>(null);
  const handle = useRef<HTMLElement | null>(null);

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

  useAutoScroll(
    {
      ref,
      autoScroll: (autoScroll || horizontal || vertical) && isDroppable,
      autoScrollWindow,
      allowedAxis: horizontal ? 'horizontal' : vertical ? 'vertical' : 'all',
    },
    // dependency array is handled inside hook
  );

  const { motioned, sortableGroups, sorting, holdingStatus } = useSortable({
    ref,
    sortable,
    data,
    hostPreview,
    motionDuration,
    group,
    itemOf,
    validGroups,
    onGroupChange,
    onSortableChange,
    extraScrollOffset,
    children,
  });

  useEffect(() => {
    if (!ref.current || !draggable) return;
    handle.current = ref.current.querySelector<HTMLElement>('[data-handle]');
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
          ...(sorting && {
            backgroundColor: 'aliceblue',
          }),
          ...(holdingStatus && {
            border: '1px solid red',
          }),
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

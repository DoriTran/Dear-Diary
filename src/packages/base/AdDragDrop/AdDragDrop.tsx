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

import type {
  ExtraScrollOffset,
  OnGroupChange,
  OnSortableChange,
} from './type';

import { type LogDebugEvent } from './logEvents';
import useAutoScroll, { type AutoScrollOptions } from './useAutoScroll';
import useDragging, {
  type UseDraggingOptions,
  type UseDraggingResult,
} from './useDragging';
import useDropping, {
  type UseDroppingOptions,
  type UseDroppingResult,
} from './useDropping';
import useSortable from './useSortable';

export interface DragStyle {
  base?: CSSProperties;
  hover?: CSSProperties;
  overlay?: CSSProperties;
  [key: string]: CSSProperties | undefined;
}

export interface DragClassName {
  base?: string;
  hover?: string;
  overlay?: string;
  [key: string]: string | undefined;
}

export interface AdDragDropProps extends Partial<AutoScrollOptions> {
  /* Dragging options */
  draggable?: boolean; // Enables drag registration;
  dragData?: UseDraggingOptions['dragData'];
  canDrag?: UseDraggingOptions['canDrag'];
  onDragStart?: UseDraggingOptions['onDragStart'];
  onDrag?: UseDraggingOptions['onDrag'];
  onDrop?: UseDraggingOptions['onDrop'];
  onTargetChange?: UseDraggingOptions['onTargetChange'];
  onGenerateOverlay?: UseDraggingOptions['onGenerateOverlay'];
  dragDeps?: unknown[];
  drag?: Partial<UseDraggingOptions>;

  /* Dropping options */
  droppable?: boolean; // Enables drop target registration;
  dropData?: UseDroppingOptions['data'];
  canDrop?: UseDroppingOptions['canDrop'];
  onCatch?: UseDroppingOptions['onCatch'];
  onDragEnter?: UseDroppingOptions['onDragEnter'];
  onDragLeave?: UseDroppingOptions['onDragLeave'];
  cursorEffect?: UseDroppingOptions['cursorEffect'];
  stopDropPropagation?: UseDroppingOptions['stopDropPropagation'];
  sticky?: UseDroppingOptions['sticky'];
  dropDeps?: unknown[];
  drop?: Partial<UseDroppingOptions>;

  /* Sortable options */
  sortable?: boolean; // Enables sortable registration, Overwrite drag preview behavior.
  hostPreview?: boolean; // Register this element as a sortable drag preview host (must be static element).
  group?: string; // Group identifier string for sortable group.
  itemOf?: string; // Group identifier string that the item CURRENTLY belongs to.
  validGroups?: string[] | undefined; // Group ids the item may sort into. Use itemOf if not provided.
  onGroupChange?: OnGroupChange; // Drag into a different group.
  onSortableChange?: OnSortableChange; // Sortable item index changed.
  extraScrollOffset?: ExtraScrollOffset; // Extra scroll offset for sortable items.

  /* Log Debug Options */
  logEvents?: LogDebugEvent[];

  /* Other Options */
  style?: DragStyle;
  className?: DragClassName | string;
  overlay?: ReactElement | null;
  native?: boolean;
  from?: string;
  showOrigin?: boolean;
  children: ReactElement;
}

const AdDragDrop: FC<AdDragDropProps> = (props) => {
  const {
    /* Dragging options */
    draggable = false,
    dragData,
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
    group,
    itemOf,
    validGroups,
    onGroupChange,
    onSortableChange,
    extraScrollOffset = { left: 0, top: 0 },

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
      dragData,
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

  const { motioned, sortableGroups } = useSortable({
    ref,
    sortable,
    hostPreview,
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
        'data-dragging': dragging ? true : undefined,
        'data-stop-drop-propagation': stopDropPropagation ? true : undefined,
        'data-sortable-item-of': sortable ? itemOf : undefined,
        'data-sortable-groups': sortable ? sortableGroups : undefined,
        style: {
          ...(children.props as { style?: CSSProperties }).style,
          ...(dragging && style.base),
          ...(hovering && style.hover),
          ...(isDraggable && {
            opacity: !showOrigin && dragging ? 0 : 1,
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

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

import { ALL_LOG_DEBUG_EVENTS, type LogDebugEvent } from './logEvents';
import useAutoScroll, { type AutoScrollOptions } from './useAutoScroll';
import useDragging, {
  type UseDraggingOptions,
  type UseDraggingResult,
} from './useDragging';
import useDropping, {
  type UseDroppingOptions,
  type UseDroppingResult,
} from './useDropping';

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
  /** Enables drag registration; set with drag-related options. */
  draggable?: boolean;

  /* dragging options */
  dragData?: UseDraggingOptions['dragData'];
  canDrag?: UseDraggingOptions['canDrag'];
  onDragStart?: UseDraggingOptions['onDragStart'];
  onDrag?: UseDraggingOptions['onDrag'];
  onDrop?: UseDraggingOptions['onDrop'];
  onTargetChange?: UseDraggingOptions['onTargetChange'];
  onGenerateOverlay?: UseDraggingOptions['onGenerateOverlay'];
  dragDeps?: unknown[];
  drag?: Partial<UseDraggingOptions>;

  /** Enables drop target registration; set with drop-related options. */
  droppable?: boolean;

  /* dropping options */
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

  /* sortable options */
  // sortInGroup?: UseSortableOptions['sortInGroup'];
  // sortableGroup?: UseSortableOptions['sortableGroup'];
  // setSortableData?: UseSortableOptions['setSortableData'];
  // onSortIndexChange?: UseSortableOptions['onSortIndexChange'];
  // onSortable?: UseSortableOptions['onSortable'];
  // extraScrollOffset?: UseSortableOptions['extraScrollOffset'];
  // motions?: UseSortableOptions['motions'];
  /**
   * Which monitor events to log. Defaults to all (see `ALL_LOG_DEBUG_EVENTS`).
   * Pass `[]` to turn logging off.
   */
  logEvents?: LogDebugEvent[];

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

    autoScroll,
    autoScrollWindow,
    horizontal,
    vertical,

    // sortInGroup,
    // motions = {},
    // sortableGroup,
    // setSortableData,
    // onSortIndexChange,
    // onSortable,
    // extraScrollOffset = { scrollLeft: 0, scrollTop: 0 },
    logEvents = ALL_LOG_DEBUG_EVENTS,

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

  // const renderedChild: ReactElement =
  //   sortInGroup && motioned ? motioned : children;
  const renderedChild: ReactElement = children;

  return (
    <>
      {cloneElement(renderedChild, {
        ref,
        'data-stop-drop-propagation': stopDropPropagation ? true : undefined,
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

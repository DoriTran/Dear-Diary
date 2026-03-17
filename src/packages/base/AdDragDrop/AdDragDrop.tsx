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

import useAutoScroll, { type AutoScrollOptions } from './useAutoScroll';
import useDragging, {
  type UseDraggingOptions,
  type UseDraggingResult,
} from './useDragging';
import useDropping, {
  type UseDroppingOptions,
  type UseDroppingResult,
} from './useDropping';
import useSortable, {
  type UseSortableOptions,
  type UseSortableResult,
} from './useSortable';

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
  /* dragging options */
  data?: UseDraggingOptions['data'];
  canDrag?: UseDraggingOptions['canDrag'];
  onDragStart?: UseDraggingOptions['onDragStart'];
  onDrag?: UseDraggingOptions['onDrag'];
  onDrop?: UseDraggingOptions['onDrop'];
  onTargetChange?: UseDraggingOptions['onTargetChange'];
  onGenerateOverlay?: UseDraggingOptions['onGenerateOverlay'];
  dragDeps?: unknown[];
  drag?: Partial<UseDraggingOptions>;

  /* dropping options */
  dropData?: UseDroppingOptions['data'];
  canDrop?: UseDroppingOptions['canDrop'];
  onCatch?: UseDroppingOptions['onCatch'];
  onDragEnter?: UseDroppingOptions['onDragEnter'];
  onDragLeave?: UseDroppingOptions['onDragLeave'];
  cursorEffect?: UseDroppingOptions['cursorEffect'];
  sticky?: UseDroppingOptions['sticky'];
  dropDeps?: unknown[];
  drop?: Partial<UseDroppingOptions>;

  /* sortable options */
  sortInGroup?: UseSortableOptions['sortInGroup'];
  sortableGroup?: UseSortableOptions['sortableGroup'];
  setSortableData?: UseSortableOptions['setSortableData'];
  onSortIndexChange?: UseSortableOptions['onSortIndexChange'];
  onSortable?: UseSortableOptions['onSortable'];
  extraScrollOffset?: UseSortableOptions['extraScrollOffset'];
  motions?: UseSortableOptions['motions'];

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

    dropData,
    canDrop,
    onCatch,
    onDragEnter,
    onDragLeave,
    cursorEffect,
    sticky,
    dropDeps = [],
    drop,

    autoScroll,
    autoScrollWindow,
    horizontal,
    vertical,

    sortInGroup,
    motions = {},
    sortableGroup,
    setSortableData,
    onSortIndexChange,
    onSortable,
    extraScrollOffset = { scrollLeft: 0, scrollTop: 0 },

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

  const { draggable, dragging, container, dragStyle }: UseDraggingResult =
    useDragging(
      {
        ref,
        handle,
        ...(data && { data }),
        ...(canDrag && { canDrag }),
        ...(onDragStart && { onDragStart }),
        ...(onDrag && { onDrag }),
        ...(onDrop && { onDrop }),
        ...(onTargetChange && { onTargetChange }),
        ...(onGenerateOverlay && { onGenerateOverlay }),
        ...(native && { native }),
        ...(overlay && { overlay: true }),
        ...(sortInGroup && { sortable: sortInGroup }),
        ...(drag ?? {}),
      },
      dragDeps,
    );

  const { droppable, hovering }: UseDroppingResult = useDropping(
    {
      ref,
      ...(dropData && { data: dropData }),
      ...(canDrop && { canDrop }),
      ...(onCatch && { onCatch }),
      ...(onDragEnter && { onDragEnter }),
      ...(onDragLeave && { onDragLeave }),
      ...(cursorEffect && { cursorEffect }),
      ...(sticky && { sticky }),
      ...(sortableGroup && { sortableGroup }),
      ...(drop ?? {}),
    },
    dropDeps,
  );

  useAutoScroll(
    {
      ref,
      autoScroll: (autoScroll || horizontal || vertical) && droppable,
      autoScrollWindow,
      allowedAxis: horizontal ? 'horizontal' : vertical ? 'vertical' : 'all',
    },
    // dependency array is handled inside hook
  );

  const { motioned, hidden }: UseSortableResult = useSortable({
    ref,
    sortInGroup,
    sortableGroup,
    setSortableData,
    onSortIndexChange,
    onSortable,
    extraScrollOffset,
    children,
    motions,
  });

  useEffect(() => {
    if (!ref.current) return;
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

  if (sortInGroup && typeof children.type !== 'string') {
    console.warn(
      `[AdDragDrop] The component "${
        (children as { type?: { name?: string } }).type?.name || 'Unknown'
      }" may not animate properly because it does not forward its ref.`,
    );
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
    sortInGroup && motioned ? motioned : children;

  return (
    <>
      {cloneElement(renderedChild, {
        ref,
        style: {
          ...(children.props as { style?: CSSProperties }).style,
          ...(dragging && style.base),
          ...(hovering && style.hover),
          ...(draggable && {
            opacity: !showOrigin && dragging ? 0 : 1,
            cursor: dragging ? 'grabbing' : 'grab',
          }),
          ...(sortInGroup && {
            ...(hidden && { display: 'none', width: 0, height: 0 }),
            transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
          }),
        } as CSSProperties,
        className: clsx(
          (children.props as { className?: string }).className,
          dragging && classNames?.base,
          hovering && classNames?.hover,
        ),
        ...(sortInGroup && { 'data-sortable': sortInGroup }),
        ...(sortableGroup && { 'data-sortable-group': sortableGroup }),
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

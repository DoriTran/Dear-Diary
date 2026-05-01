import type {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { CSSProperties, ReactElement } from 'react';

import type { LogDebugEvent } from './logEvents';
import type { AutoScrollOptions } from './useAutoScroll';
import type { UseDraggingOptions } from './useDragging';
import type { UseDroppingOptions } from './useDropping';

// #region Dragging types
export type DraggableOptions = Parameters<typeof draggable>[0];

export type DraggableElement = DraggableOptions['element'];
export type DragHandle = DraggableOptions['dragHandle'];
export type GetInitialData = DraggableOptions['getInitialData'];
export type CanDrag = DraggableOptions['canDrag'];
export type OnGenerateDragPreview = DraggableOptions['onGenerateDragPreview'];
export type OnDragStart = DraggableOptions['onDragStart'];
export type OnDrag = DraggableOptions['onDrag'];
export type OnDrop = DraggableOptions['onDrop'];

export type DragStartArgs = Parameters<
  NonNullable<DraggableOptions['onDragStart']>
>[0];

export type DragArgs = Parameters<NonNullable<DraggableOptions['onDrag']>>[0];

export type DragDropArgs = Parameters<
  NonNullable<DraggableOptions['onDrop']>
>[0];

export type DragPreviewArgs = Parameters<
  NonNullable<DraggableOptions['onGenerateDragPreview']>
>[0];
// #endregion

// #region Dropping types
export type DropTargetOptions = Parameters<typeof dropTargetForElements>[0];

export type DropTargetElement = DropTargetOptions['element'];
export type GetData = DropTargetOptions['getData'];
export type CanDrop = DropTargetOptions['canDrop'];

export type OnDragEnter = DropTargetOptions['onDragEnter'];
export type OnDragLeave = DropTargetOptions['onDragLeave'];
export type OnDropTargetChange = DropTargetOptions['onDropTargetChange'];
export type OnCatch = DropTargetOptions['onDrop'];

export type DropArgs = Parameters<NonNullable<DropTargetOptions['onDrop']>>[0];

export type DragEnterArgs = Parameters<
  NonNullable<DropTargetOptions['onDragEnter']>
>[0];

export type DragLeaveArgs = Parameters<
  NonNullable<DropTargetOptions['onDragLeave']>
>[0];

export type DropTargetChangeArgs = Parameters<
  NonNullable<DropTargetOptions['onDropTargetChange']>
>[0];

export type GetDataArgs = Parameters<
  NonNullable<DropTargetOptions['getData']>
>[0];
// #endregion

// #region Sortable types
export type OnGroupChange = (args: {
  type: 'enter' | 'leave';
  index: number;
  data: any;
}) => boolean | void;

export type OnSortableChange = (args: {
  current: number;
  previous: number;
}) => boolean | void;

export type ExtraScrollOffset = {
  scrollLeft: number;
  scrollTop: number;
};
// #endregion

// #region AdDragDrop props
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

type LooseDragData = UseDraggingOptions['data'];

type DragDataFeedbackArgs = {
  element: HTMLElement;
  input: unknown;
  dragHandle: HTMLElement | null;
  [key: string]: unknown;
};

/** Drag payload or getter that must include `id` when `sortable` and `itemOf` are set. */
export type DragDataWithId =
  | (Record<string, unknown> & { id: unknown })
  | ((args: DragDataFeedbackArgs) => Record<string, unknown> & { id: unknown });

interface AdDragDropPropsBase extends Partial<AutoScrollOptions> {
  /* Dragging options */
  draggable?: boolean;
  canDrag?: UseDraggingOptions['canDrag'];
  onDragStart?: UseDraggingOptions['onDragStart'];
  onDrag?: UseDraggingOptions['onDrag'];
  onDrop?: UseDraggingOptions['onDrop'];
  onTargetChange?: UseDraggingOptions['onTargetChange'];
  onGenerateOverlay?: UseDraggingOptions['onGenerateOverlay'];
  dragDeps?: unknown[];
  drag?: Partial<UseDraggingOptions>;

  /* Dropping options */
  droppable?: boolean;
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

  /* Sortable options (sortable / itemOf narrowed on `AdDragDropProps`) */
  hostPreview?: boolean;
  motionDuration?: number;
  group?: string;
  validGroups?: string[] | undefined;
  onGroupChange?: OnGroupChange;
  onSortableChange?: OnSortableChange;
  extraScrollOffset?: ExtraScrollOffset;

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

export type AdDragDropProps =
  | (AdDragDropPropsBase & {
      sortable: true;
      itemOf: string;
      data: DragDataWithId;
    })
  | (AdDragDropPropsBase & {
      sortable: true;
      itemOf?: undefined;
      data?: LooseDragData;
    })
  | (AdDragDropPropsBase & {
      sortable?: false | undefined;
      itemOf?: string;
      data?: LooseDragData;
    });

// #endregion

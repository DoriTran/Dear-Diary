import type {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

/* ----------------------------- */
/* draggable types */
/* ----------------------------- */

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

/* ----------------------------- */
/* drop target types */
/* ----------------------------- */

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

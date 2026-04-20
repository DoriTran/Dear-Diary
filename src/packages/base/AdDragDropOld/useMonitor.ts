import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect } from 'react';

/**
 * Track all elements that can be monitored
 * have applied draggable and are currently being dragged
 */

type MonitorOptions = Parameters<typeof monitorForElements>[0];
type ExtractArg<T> = T extends (arg: infer A) => unknown ? A : never;
type WithData<T extends { source: { data: unknown } }> = T & {
  data: T['source']['data'];
};

type CanMonitorArg = ExtractArg<MonitorOptions['canMonitor']>;
type DragStartArg = ExtractArg<MonitorOptions['onDragStart']>;
type DragArg = ExtractArg<MonitorOptions['onDrag']>;
type DropArg = ExtractArg<MonitorOptions['onDrop']>;
type TargetChangeArg = ExtractArg<MonitorOptions['onDropTargetChange']>;
type PreviewArg = ExtractArg<MonitorOptions['onGenerateDragPreview']>;

export interface UseMonitorOptions {
  canMonitor?: boolean | ((arg: WithData<CanMonitorArg>) => boolean);

  onDragStart?: (arg: WithData<DragStartArg>) => void;
  onDrag?: (arg: WithData<DragArg>) => void;
  onDrop?: (arg: WithData<DropArg>) => void;

  onTargetChange?: (arg: WithData<TargetChangeArg>) => void;
  onGenerateOverlay?: (arg: WithData<PreviewArg>) => void;
}

const useMonitor = (
  options: UseMonitorOptions,
  monitorDeps: unknown[] = [],
): void => {
  const {
    canMonitor,
    onDragStart,
    onDrag,
    onDrop,
    onTargetChange,
    onGenerateOverlay,
  } = options;

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ initial, source }) => {
        if (canMonitor === undefined) return true;

        return typeof canMonitor === 'function'
          ? canMonitor({ data: source.data, initial, source })
          : canMonitor;
      },

      /** arg: ({ source, location }) */
      onDragStart: (arg) => onDragStart?.({ ...arg, data: arg.source.data }),
      onDrag: (arg) => onDrag?.({ ...arg, data: arg.source.data }),
      onDrop: (arg) => onDrop?.({ ...arg, data: arg.source.data }),
      onDropTargetChange: (arg) =>
        onTargetChange?.({ ...arg, data: arg.source.data }),

      onGenerateDragPreview: (arg) =>
        onGenerateOverlay?.({ ...arg, data: arg.source.data }),
    });
  }, [
    canMonitor,
    onDragStart,
    onDrag,
    onDrop,
    onTargetChange,
    onGenerateOverlay,
    ...monitorDeps,
  ]);
};

export default useMonitor;

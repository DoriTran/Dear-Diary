import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { useEffect, useMemo, useState, type RefObject } from 'react';

import type { LogDebugEvent } from './logEvents';
import type {
  DragArgs,
  DragDropArgs,
  DragPreviewArgs,
  DragStartArgs,
} from './type';

import { logEvents } from './logEvents';
import useMonitor from './useMonitor';

type GetFeedbackArgs = {
  element: HTMLElement;
  input: unknown;
  dragHandle: HTMLElement | null;
  [key: string]: any;
};

export interface UseDraggingOptions {
  ref: RefObject<HTMLElement | null>;
  handle?: RefObject<HTMLElement | null>;

  /** When false, drag behavior is not registered. */
  draggable?: boolean;

  dragData?:
    | Record<string, unknown>
    | ((args: GetFeedbackArgs) => Record<string, unknown>);

  canDrag?: boolean | ((args: GetFeedbackArgs) => boolean);

  onDragStart?: (args: DragStartArgs & { data: unknown }) => void;
  onDrag?: (args: DragArgs & { data: unknown }) => void;
  onDrop?: (args: DragDropArgs & { data: unknown }) => void;
  onTargetChange?: (args: DragDropArgs & { data: unknown }) => void;

  onGenerateOverlay?: (args: DragPreviewArgs & { data: unknown }) => void;

  native?: boolean;
  overlay?: boolean;

  /**
   * Which monitor events to log.
   * Pass `[]` to turn logging off.
   */
  logEvents?: readonly LogDebugEvent[];
}

export interface UseDraggingResult {
  draggable: boolean;
  dragging: boolean;
  container: HTMLElement | null;
  dragStyle: {
    position: 'fixed';
    width: string;
    height: string;
    top: string;
    left: string;
  };
}

export default function useDragging(
  drags: UseDraggingOptions,
  dependencies: unknown[] = [],
): UseDraggingResult {
  const [dragging, setDragging] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [style, setStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  const log = useMemo(
    () => new Set<LogDebugEvent>(drags.logEvents ?? []),
    [drags.logEvents],
  );

  const logEnabled = log.size > 0;
  const logEvent: (
    enabled: ReadonlySet<LogDebugEvent>,
    event: LogDebugEvent,
    payload: unknown,
  ) => void = logEvents;

  useMonitor(
    {
      enabled: Boolean(drags.draggable) || logEnabled,
      canMonitor: ({ source }) => {
        const root = drags.ref.current;
        if (!root) return false;
        return source.element === root;
      },
      onDragStart: (arg) => {
        logEvent(log, 'dragStart', arg);
      },
      onDrag: (arg) => {
        setDragging(true);
        logEvent(log, 'drag', arg);
      },
      onTargetChange: (arg) => {
        logEvent(log, 'targetChange', arg);
      },
      onDrop: (arg) => {
        setDragging(false);
        logEvent(log, 'drop', arg);
      },
      onGenerateOverlay: (arg) => {
        logEvent(log, 'preview', arg);
      },
    },
    [drags.ref, drags.draggable, logEnabled, log],
  );

  useEffect(() => {
    const el = drags.ref.current;
    const handle = drags.handle?.current ?? undefined;

    if (!el || !drags.draggable) return;

    return draggable({
      element: el,
      dragHandle: handle,

      getInitialData: (args: any) =>
        typeof drags.dragData === 'function'
          ? drags.dragData(args)
          : (drags.dragData ?? {}),

      canDrag: (args: any) => {
        if (drags.canDrag === undefined) return true;

        return typeof drags.canDrag === 'function'
          ? drags.canDrag(args)
          : Boolean(drags.canDrag);
      },

      onDragStart: ({ source, location }: DragStartArgs) => {
        drags.onDragStart?.({
          data: source.data,
          source,
          location,
        });

        setDragging(true);

        if (!drags.native) {
          const { pageX, pageY } = location.initial.input;

          setStyle((prev) => ({
            ...prev,
            left: pageX - offset.x,
            top: pageY - offset.y,
          }));

          const overlayContainer = document.createElement('div');

          overlayContainer.style.position = 'fixed';
          overlayContainer.style.zIndex = '2147483647';
          overlayContainer.style.pointerEvents = 'none';

          document.body.appendChild(overlayContainer);

          setContainer(overlayContainer);
        }
      },

      /* -------------------------------- DRAG ------------------------------- */

      onDrag: ({ source, location }: DragArgs) => {
        drags.onDrag?.({
          data: source.data,
          source,
          location,
        });

        if (!drags.native) {
          setStyle((prev) => ({
            ...prev,
            left: location.current.input.pageX - offset.x,
            top: location.current.input.pageY - offset.y,
          }));
        }
      },

      /* -------------------------------- DROP ------------------------------- */

      onDrop: ({ source, location }: DragDropArgs) => {
        drags.onDrop?.({
          data: source.data,
          source,
          location,
        });

        setDragging(false);

        if (!drags.native && container) {
          document.body.removeChild(container);
        }

        setContainer(null);
      },

      /* -------------------------- TARGET CHANGE --------------------------- */

      onDropTargetChange: ({ source, location }: DragDropArgs) => {
        drags.onTargetChange?.({
          data: source.data,
          source,
          location,
        });
      },

      /* -------------------------- DRAG PREVIEW GEN ------------------------ */

      onGenerateDragPreview: ({
        nativeSetDragImage,
        location,
        source,
      }: DragPreviewArgs) => {
        if (!nativeSetDragImage) {
          return;
        }

        if (drags.overlay) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: source.element,
              input: location.current.input,
            }),
            render({ container: ctn }) {
              setContainer(ctn);
            },
          });
          return;
        }

        if (!drags.native) {
          const rect = source.element.getBoundingClientRect();
          const { input } = location.current;

          setOffset({
            x: input.clientX - rect.x,
            y: input.clientY - rect.y,
          });

          setStyle((prev) => ({
            ...prev,
            width: rect.width,
            height: rect.height,
          }));

          disableNativeDragPreview({ nativeSetDragImage });
          return;
        }

        drags.onGenerateOverlay?.({
          data: source.data,
          nativeSetDragImage,
          location,
          source,
        });
      },
    });
  }, [drags, offset, container, ...dependencies]);

  return {
    draggable: Boolean(drags.draggable),
    dragging,
    container,
    dragStyle: {
      position: 'fixed',
      width: `${style.width}px`,
      height: `${style.height}px`,
      top: `${style.top}px`,
      left: `${style.left}px`,
    },
  };
}

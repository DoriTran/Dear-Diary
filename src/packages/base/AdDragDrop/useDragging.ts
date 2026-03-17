import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { useEffect, useMemo, useState, type RefObject } from 'react';

import type {
  DragArgs,
  DragDropArgs,
  DragPreviewArgs,
  DragStartArgs,
} from './type';

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

  data?:
    | Record<string, unknown>
    | ((_args: GetFeedbackArgs) => Record<string, unknown>);

  canDrag?: boolean | ((_args: GetFeedbackArgs) => boolean);

  onDragStart?: (_args: DragStartArgs & { data: unknown }) => void;
  onDrag?: (_args: DragArgs & { data: unknown }) => void;
  onDrop?: (_args: DragDropArgs & { data: unknown }) => void;
  onTargetChange?: (_args: DragDropArgs & { data: unknown }) => void;

  onGenerateOverlay?: (_args: DragPreviewArgs & { data: unknown }) => void;

  native?: boolean;
  overlay?: boolean;
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

  useMonitor(
    {
      canMonitor: ({ data }) => {
        const id = (drags.data as { id?: string })?.id;
        return data.id === id || `${String(data.id)}-clone` === id;
      },

      onDrag: () => setDragging(true),
      onDrop: () => setDragging(false),
    },
    [drags.data],
  );

  const isDraggable = useMemo(() => {
    const { handle, ...others } = drags;
    void handle;
    return Object.keys(others).length !== 0;
  }, [drags]);

  useEffect(() => {
    const el = drags.ref.current;
    const handle = drags.handle?.current ?? undefined;

    if (!el || !isDraggable) return;

    return draggable({
      element: el,
      dragHandle: handle,

      getInitialData: (args: any) =>
        typeof drags.data === 'function'
          ? drags.data(args)
          : (drags.data ?? {}),

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
  }, [drags, isDraggable, offset, container, ...dependencies]);

  return {
    draggable: isDraggable,
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

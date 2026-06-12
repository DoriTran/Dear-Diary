import { useCallback, useRef, type PointerEventHandler } from 'react';

import { showAdNotification } from '@/packages/base';

const DRAG_THRESHOLD_PX = 8;
const DEBOUNCE_MS = 2000;

export const useDragBlockedNotice = (blocked: boolean) => {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lastShownRef = useRef(0);
  const notifiedRef = useRef(false);

  const onPointerDown: PointerEventHandler = useCallback(
    (event) => {
      if (!blocked) {
        return;
      }

      startRef.current = { x: event.clientX, y: event.clientY };
      notifiedRef.current = false;
    },
    [blocked],
  );

  const onPointerMove: PointerEventHandler = useCallback(
    (event) => {
      if (!blocked || !startRef.current || notifiedRef.current) {
        return;
      }

      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;

      if (Math.hypot(dx, dy) <= DRAG_THRESHOLD_PX) {
        return;
      }

      const now = Date.now();

      if (now - lastShownRef.current <= DEBOUNCE_MS) {
        return;
      }

      lastShownRef.current = now;
      notifiedRef.current = true;

      showAdNotification({
        title: 'Reorder disabled',
        message:
          'Reorder is disabled while search or a filter is active. Clear them to drag items.',
      });
    },
    [blocked],
  );

  const clearPointer = useCallback(() => {
    startRef.current = null;
  }, []);

  return {
    onPointerDownCapture: onPointerDown,
    onPointerMoveCapture: onPointerMove,
    onPointerUpCapture: clearPointer,
    onPointerCancelCapture: clearPointer,
  };
};

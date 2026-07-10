import { useEffect, useState, type RefObject } from 'react';

export type TicketSurfaceSize = {
  width: number;
  height: number;
};

export function useTicketSurfaceSize(
  ref: RefObject<HTMLElement | null>,
): TicketSurfaceSize {
  const [size, setSize] = useState<TicketSurfaceSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({
        width: Math.round(width),
        height: Math.round(height),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

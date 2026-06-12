import { useLayoutEffect, useRef } from 'react';

/** Keep a ref synced with the latest value without assigning during render (React 19). */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}

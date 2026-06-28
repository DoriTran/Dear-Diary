import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react';

import { hexToHsv, hsvToHex, normalizeHex } from '@/packages/color';

const THUMB_INSET = 7;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type Hsv = { h: number; s: number; v: number };

export type ColorPickerState = {
  hex: string;
  hue: number;
  saturation: number;
  brightness: number;
  syncFromHex: (hex: string) => void;
  syncFromHsv: (h: number, s: number, v: number) => void;
  handleSbPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handleSbPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  handleSbPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  handleHueChange: (hue: number) => void;
};

const readSbPointer = (
  event: PointerEvent<HTMLDivElement>,
  hue: number,
  applyHsv: (h: number, s: number, v: number) => void,
) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const innerWidth = Math.max(rect.width - THUMB_INSET * 2, 1);
  const innerHeight = Math.max(rect.height - THUMB_INSET * 2, 1);
  const x = clamp(event.clientX - rect.left - THUMB_INSET, 0, innerWidth);
  const y = clamp(event.clientY - rect.top - THUMB_INSET, 0, innerHeight);
  const s = (x / innerWidth) * 100;
  const v = (1 - y / innerHeight) * 100;
  applyHsv(hue, s, v);
};

export const getSbThumbStyle = (saturation: number, brightness: number) => ({
  left: `calc(${THUMB_INSET}px + ${saturation / 100} * (100% - ${THUMB_INSET * 2}px))`,
  top: `calc(${THUMB_INSET}px + ${(100 - brightness) / 100} * (100% - ${THUMB_INSET * 2}px))`,
});

export const useColorPickerState = (
  value: string,
  onChange: (hex: string) => void,
): ColorPickerState => {
  const normalizedValue = useMemo(() => normalizeHex(value), [value]);
  const lastEmitted = useRef(normalizedValue);
  const hsvRef = useRef<Hsv>(hexToHsv(normalizedValue));
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(normalizedValue));

  useEffect(() => {
    if (normalizedValue === lastEmitted.current) {
      return;
    }

    const next = hexToHsv(normalizedValue);
    hsvRef.current = next;
    setHsv(next);
    lastEmitted.current = normalizedValue;
  }, [normalizedValue]);

  const applyHsv = useCallback(
    (h: number, s: number, v: number) => {
      const nextHsv = { h, s, v };
      hsvRef.current = nextHsv;
      setHsv(nextHsv);
      const nextHex = normalizeHex(hsvToHex(h, s, v));
      lastEmitted.current = nextHex;
      onChange(nextHex);
    },
    [onChange],
  );

  const syncFromHex = useCallback(
    (nextHex: string) => {
      const normalized = normalizeHex(nextHex);
      const nextHsv = hexToHsv(normalized);
      hsvRef.current = nextHsv;
      setHsv(nextHsv);
      lastEmitted.current = normalized;
      onChange(normalized);
    },
    [onChange],
  );

  const syncFromHsv = applyHsv;

  const handleSbPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      readSbPointer(event, hsvRef.current.h, applyHsv);
    },
    [applyHsv],
  );

  const handleSbPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        return;
      }
      readSbPointer(event, hsvRef.current.h, applyHsv);
    },
    [applyHsv],
  );

  const handleSbPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleHueChange = useCallback(
    (nextHue: number) => {
      applyHsv(nextHue, hsvRef.current.s, hsvRef.current.v);
    },
    [applyHsv],
  );

  const hex = useMemo(() => hsvToHex(hsv.h, hsv.s, hsv.v), [hsv]);

  return {
    hex,
    hue: hsv.h,
    saturation: hsv.s,
    brightness: hsv.v,
    syncFromHex,
    syncFromHsv,
    handleSbPointerDown,
    handleSbPointerMove,
    handleSbPointerUp,
    handleHueChange,
  };
};

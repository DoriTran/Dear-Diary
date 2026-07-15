import { useMemo } from 'react';

import { useAppStore, useDiaryStore } from '@/store';

import type { ColorId, ResolvedPalette } from './types';

import { resolveColor } from './resolvePalette';

export const useResolvedPalette = (colorId: ColorId): ResolvedPalette => {
  const mode = useAppStore('mode');
  const customPalettes = useDiaryStore('customPalettes');

  return useMemo(
    () => resolveColor(colorId, mode, customPalettes),
    [colorId, mode, customPalettes],
  );
};

import { useMemo } from 'react';

import { useAppStore } from '@/store';
import { useDiaryStore } from '@/store';

import { resolveColor } from './resolvePalette';
import type { ColorId, ResolvedPalette } from './types';

export const useResolvedPalette = (colorId: ColorId): ResolvedPalette => {
  const mode = useAppStore('mode');
  const customPalettes = useDiaryStore('customPalettes');

  return useMemo(
    () => resolveColor(colorId, mode, customPalettes),
    [colorId, mode, customPalettes],
  );
};

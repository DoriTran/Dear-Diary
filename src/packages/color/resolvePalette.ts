import type { AppMode } from '@/store/app/type';

import type {
  ColorId,
  ColorPalette,
  CustomPalette,
  ResolvedPalette,
} from './types';

import { getColorDefinition } from './colorRegistry';
import { COLOR_PRESETS, DEFAULT_COLOR_ID } from './presets';

export const getAppMode = (): AppMode => {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.getAttribute('data-mode') === 'dark'
    ? 'dark'
    : 'light';
};

export const resolvePalette = (
  colorId: ColorId,
  mode: AppMode,
  customPalettes: Record<string, CustomPalette> = {},
): ColorPalette => {
  const definition = getColorDefinition(colorId, customPalettes);

  if (definition) {
    return definition[mode];
  }

  return COLOR_PRESETS[DEFAULT_COLOR_ID][mode];
};

export const resolveColor = (
  colorId: ColorId,
  mode: AppMode,
  customPalettes: Record<string, CustomPalette> = {},
): ResolvedPalette => {
  const palette = resolvePalette(colorId, mode, customPalettes);
  const definition = getColorDefinition(colorId, customPalettes);

  return {
    ...palette,
    colorId,
    name: definition?.name ?? 'Color',
  };
};

import type { CSSProperties } from 'react';

import type { AppMode } from '@/store/app/type';

import type { ColorId, ColorPalette, CustomPalette } from './types';

import { resolvePalette } from './resolvePalette';

export const chatboxCssVars = (
  colorId: ColorId,
  mode: AppMode,
  customPalettes: Record<string, CustomPalette> = {},
): CSSProperties => {
  const palette = resolvePalette(colorId, mode, customPalettes);

  return {
    '--chatbox-soft': palette.soft,
    '--chatbox-main': palette.main,
    '--chatbox-strong': palette.strong,
  } as CSSProperties;
};

export const tagStyles = (palette: ColorPalette): CSSProperties => ({
  background: palette.soft,
  color: palette.strong,
});

export const groupLabelStyles = (palette: ColorPalette): CSSProperties => ({
  background: palette.main,
  color: palette.strong,
});

export const iconBackground = (palette: ColorPalette): string => palette.soft;

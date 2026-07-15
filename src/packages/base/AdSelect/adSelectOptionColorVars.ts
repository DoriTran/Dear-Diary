import type { CSSProperties } from 'react';

import type { ColorPalette } from '@/packages/color';

/** Per-option CSS vars for AdSelect color-aware hover/selected states. */
export const adSelectOptionColorVars = (palette: ColorPalette): CSSProperties =>
  ({
    '--adselect-option-hover-bg': `color-mix(in srgb, ${palette.main} 20%, var(--surface-soft))`,
    '--adselect-option-hover-color': palette.strong,
    '--adselect-option-selected-bg': `color-mix(in srgb, ${palette.main} 28%, var(--surface-soft))`,
  }) as CSSProperties;

export const adSelectRowIconVars = (palette: ColorPalette): CSSProperties =>
  ({
    '--adselect-row-icon-bg': palette.soft,
    '--adselect-row-icon-color': palette.strong,
  }) as CSSProperties;

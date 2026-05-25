import type { AppMode, AppTheme } from './type';

export const DEFAULT_THEME: AppTheme = 'wheat';
export const DEFAULT_MODE: AppMode = 'light';

export const THEME_OPTIONS = [
  { id: 'wheat' as const, label: 'Wheat', swatch: '#e7a73d' },
  { id: 'blush' as const, label: 'Blush', swatch: '#f6a8b8' },
  { id: 'lavender' as const, label: 'Lavender', swatch: '#c4b5fd' },
  { id: 'mint' as const, label: 'Mint', swatch: '#6ee7b7' },
] as const;

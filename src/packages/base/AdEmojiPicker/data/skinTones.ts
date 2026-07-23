import type { EmojiEntry } from './types';

import { unifiedToNative } from './utils';

export type SkinToneId =
  | 'default'
  | '1f3fb'
  | '1f3fc'
  | '1f3fd'
  | '1f3fe'
  | '1f3ff';

export type SkinToneOption = {
  id: SkinToneId;
  /** Fill color for the ellipse icon / swatch */
  iconColor: string;
  /** Lighter background for the trigger button */
  buttonBg: string;
  label: string;
};

export const SKIN_TONE_STORAGE_KEY = 'ad-emoji-skin-tone';

/** Five Fitzpatrick tones shown as swatches (excludes default). */
export const SKIN_TONE_SWATCHES: SkinToneOption[] = [
  {
    id: '1f3fb',
    iconColor: '#F9D7C5',
    buttonBg: '#FDF0E8',
    label: 'Light',
  },
  {
    id: '1f3fc',
    iconColor: '#E0BB95',
    buttonBg: '#F5E6D4',
    label: 'Medium light',
  },
  {
    id: '1f3fd',
    iconColor: '#C68E60',
    buttonBg: '#EEDCC8',
    label: 'Medium',
  },
  {
    id: '1f3fe',
    iconColor: '#A56B3C',
    buttonBg: '#E5D0B8',
    label: 'Medium dark',
  },
  {
    id: '1f3ff',
    iconColor: '#6B3F24',
    buttonBg: '#DCC8B4',
    label: 'Dark',
  },
];

export const DEFAULT_SKIN_TONE: SkinToneOption = {
  id: 'default',
  iconColor: '#F5C542',
  buttonBg: '#FBEFC4',
  label: 'Default',
};

export const ALL_SKIN_TONES: SkinToneOption[] = [
  DEFAULT_SKIN_TONE,
  ...SKIN_TONE_SWATCHES,
];

export const getSkinToneOption = (id: SkinToneId): SkinToneOption => {
  return ALL_SKIN_TONES.find((tone) => tone.id === id) ?? DEFAULT_SKIN_TONE;
};

export const isSkinToneId = (value: string): value is SkinToneId => {
  return ALL_SKIN_TONES.some((tone) => tone.id === value);
};

export const readStoredSkinTone = (): SkinToneId => {
  try {
    const stored = localStorage.getItem(SKIN_TONE_STORAGE_KEY);

    if (stored && isSkinToneId(stored)) {
      return stored;
    }
  } catch {
    // ignore (SSR / privacy mode)
  }

  return 'default';
};

export const writeStoredSkinTone = (tone: SkinToneId): void => {
  try {
    localStorage.setItem(SKIN_TONE_STORAGE_KEY, tone);
  } catch {
    // ignore
  }
};

/** Resolve the unified codepoint id with the active skin tone applied when possible. */
export const applySkinToneUnified = (
  entry: EmojiEntry,
  tone: SkinToneId,
): string => {
  if (tone === 'default' || !entry.v?.length) {
    return entry.u;
  }

  const matched =
    entry.v.find((unified) => unified.endsWith(`-${tone}`)) ??
    entry.v.find((unified) => unified.includes(`-${tone}`));

  return matched ?? entry.u;
};

/** Resolve native emoji string with the active skin tone applied when possible. */
export const applySkinTone = (entry: EmojiEntry, tone: SkinToneId): string =>
  unifiedToNative(applySkinToneUnified(entry, tone));

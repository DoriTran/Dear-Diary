import type { EmojiEntry } from './types';

/** Convert a unified id like "1f600" or "1f468-200d-1f469" to a native emoji string. */
export const unifiedToNative = (unified: string): string => {
  return unified
    .split('-')
    .map((part) => String.fromCodePoint(Number.parseInt(part, 16)))
    .join('');
};

export const emojiMatchesQuery = (
  entry: EmojiEntry,
  query: string,
): boolean => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  if (entry.u.toLowerCase().includes(normalized)) {
    return true;
  }

  return entry.n.some((name) => name.toLowerCase().includes(normalized));
};

import type { EmojiCategoryId, EmojiDataset, EmojiEntry } from './types';

import { getCustomEmojiByShortcode } from '../customEmojis';
import { EMOJI_CATEGORY_ORDER } from './categories';
import emojiDataset from './emojis-en.json';
import { emojiMatchesQuery } from './utils';

export type { EmojiCategoryId, EmojiDataset, EmojiEntry } from './types';
export { EMOJI_CATEGORY_LABELS, EMOJI_CATEGORY_ORDER } from './categories';
export { emojiMatchesQuery, unifiedToNative } from './utils';
export {
  ALL_SKIN_TONES,
  DEFAULT_SKIN_TONE,
  SKIN_TONE_STORAGE_KEY,
  SKIN_TONE_SWATCHES,
  applySkinTone,
  getSkinToneOption,
  isSkinToneId,
  readStoredSkinTone,
  writeStoredSkinTone,
  type SkinToneId,
  type SkinToneOption,
} from './skinTones';

export const emojiData = emojiDataset as EmojiDataset;

export const getEmojisByCategory = (
  categoryId: EmojiCategoryId,
): EmojiEntry[] => {
  return emojiData.emojis[categoryId] ?? [];
};

export const filterEmojisByQuery = (
  entries: EmojiEntry[],
  query: string,
): EmojiEntry[] => {
  return entries.filter((entry) => emojiMatchesQuery(entry, query));
};

/** Flat list of all standard (non-custom) emojis in category order. */
export const getAllStandardEmojis = (): EmojiEntry[] => {
  return EMOJI_CATEGORY_ORDER.flatMap((categoryId) =>
    getEmojisByCategory(categoryId),
  );
};

export const FREQUENT_EMOJI_LIMIT = 16;

/** Default “frequently used” presets (unified ids). */
export const FREQUENT_EMOJI_UNIFIED = [
  '1f44d', // thumbs up
  '2764-fe0f', // red heart
  '1f600', // grinning
  '1f622', // crying
  '1f64f', // folded hands
  '1f44e', // thumbs down
  '1f621', // angry
  '1f602', // joy
  '1f525', // fire
  '1f389', // party
  '2b50', // star
  '1f338', // cherry blossom
] as const;

const standardEmojiByUnified = new Map<string, EmojiEntry>();

const getStandardEmojiByUnified = (unified: string): EmojiEntry | undefined => {
  if (standardEmojiByUnified.size === 0) {
    for (const entry of getAllStandardEmojis()) {
      standardEmojiByUnified.set(entry.u, entry);
    }
  }

  return standardEmojiByUnified.get(unified);
};

/** True if id is a known standard unified id or a custom shortcode (`:Happy:`). */
export const isValidEmojiPrefId = (id: string): boolean => {
  if (getCustomEmojiByShortcode(id)) {
    return true;
  }

  return getStandardEmojiByUnified(id) !== undefined;
};

export const getStandardEmojiEntry = getStandardEmojiByUnified;

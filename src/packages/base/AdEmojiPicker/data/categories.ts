import type { EmojiCategoryId } from './types';

/** Category order for navigation / scroll sections (excludes suggested/custom). */
export const EMOJI_CATEGORY_ORDER: EmojiCategoryId[] = [
  'smileys_people',
  'animals_nature',
  'food_drink',
  'travel_places',
  'activities',
  'objects',
  'symbols',
  'flags',
];

export const EMOJI_CATEGORY_LABELS: Record<EmojiCategoryId, string> = {
  suggested: 'Frequently Used',
  custom: 'Custom Emojis',
  smileys_people: 'Smileys & People',
  animals_nature: 'Animals & Nature',
  food_drink: 'Food & Drink',
  travel_places: 'Travel & Places',
  activities: 'Activities',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
};

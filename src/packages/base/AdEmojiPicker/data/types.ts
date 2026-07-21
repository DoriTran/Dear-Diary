export type EmojiCategoryId =
  | 'suggested'
  | 'custom'
  | 'smileys_people'
  | 'animals_nature'
  | 'food_drink'
  | 'travel_places'
  | 'activities'
  | 'objects'
  | 'symbols'
  | 'flags';

export type EmojiEntry = {
  /** Search / display names */
  n: string[];
  /** Unified codepoint id, e.g. "1f600" or "1f468-200d-1f469" */
  u: string;
  /** Unicode version added */
  a: string;
  /** Skin-tone variation unified ids */
  v?: string[];
};

export type EmojiDataset = {
  categories: Record<
    string,
    {
      category: string;
      name: string;
    }
  >;
  emojis: Partial<Record<EmojiCategoryId, EmojiEntry[]>> & {
    smileys_people: EmojiEntry[];
    animals_nature: EmojiEntry[];
    food_drink: EmojiEntry[];
    travel_places: EmojiEntry[];
    activities: EmojiEntry[];
    objects: EmojiEntry[];
    symbols: EmojiEntry[];
    flags: EmojiEntry[];
  };
};

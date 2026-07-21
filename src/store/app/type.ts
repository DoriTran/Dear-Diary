export type AppTheme = 'wheat' | 'blush' | 'lavender' | 'mint';

export type AppMode = 'light' | 'dark';

export type NavPanelState = {
  folded: boolean;
};

export type DiaryPageUIState = {
  selectedChatboxId: string | null;
  expandedGroupIds: Set<string>;
};

export type IconPickerPrefs = {
  recent: string[];
  favorites: string[];
};

export type EmojiPickerPrefs = {
  frequent: string[];
  favorites: string[];
};

import type { ColorId } from '@/packages/color';

export type ColorPickerPrefs = {
  recent: ColorId[];
};

export type AppStoreState = {
  navPanel: NavPanelState;
  diaryPage: DiaryPageUIState;
  iconPickerPrefs: IconPickerPrefs;
  emojiPickerPrefs: EmojiPickerPrefs;
  colorPickerPrefs: ColorPickerPrefs;
};

export type AppStoreActions = {
  setNavPanelFolded: (folded: boolean) => void;
  selectChatbox: (chatboxId: string | null) => void;
  toggleGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
  addRecentIcon: (iconId: string) => void;
  clearRecentIcons: () => void;
  toggleFavoriteIcon: (iconId: string) => void;
  setFavoriteIcons: (iconIds: string[]) => void;
  addFrequentEmoji: (emojiId: string) => void;
  clearFrequentEmojis: () => void;
  toggleFavoriteEmoji: (emojiId: string) => void;
  setFavoriteEmojis: (emojiIds: string[]) => void;
  addRecentColor: (colorId: ColorId) => void;
  removeRecentColor: (colorId: ColorId) => void;
  clearRecentColors: () => void;
};

export type AppStore = AppStoreState & AppStoreActions;

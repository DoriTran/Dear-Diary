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

import type { ColorId } from '@/packages/color';

export type ColorPickerPrefs = {
  recent: ColorId[];
};

export type AppStoreState = {
  theme: AppTheme;
  mode: AppMode;
  navPanel: NavPanelState;
  diaryPage: DiaryPageUIState;
  iconPickerPrefs: IconPickerPrefs;
  colorPickerPrefs: ColorPickerPrefs;
};

export type AppStoreActions = {
  setTheme: (theme: AppTheme) => void;
  setMode: (mode: AppMode) => void;
  setNavPanelFolded: (folded: boolean) => void;
  selectChatbox: (chatboxId: string | null) => void;
  toggleGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
  addRecentIcon: (iconId: string) => void;
  clearRecentIcons: () => void;
  toggleFavoriteIcon: (iconId: string) => void;
  setFavoriteIcons: (iconIds: string[]) => void;
  addRecentColor: (colorId: ColorId) => void;
  removeRecentColor: (colorId: ColorId) => void;
  clearRecentColors: () => void;
};

export type AppStore = AppStoreState & AppStoreActions;

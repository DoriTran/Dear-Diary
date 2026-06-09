export type AppTheme = 'wheat' | 'blush' | 'lavender' | 'mint';

export type AppMode = 'light' | 'dark';

export type NavPanelState = {
  folded: boolean;
};

export type DiaryPageUIState = {
  selectedChatboxId: string | null;
  expandedGroupIds: string[];
};

export type AppStoreState = {
  theme: AppTheme;
  mode: AppMode;
  navPanel: NavPanelState;
  diaryPage: DiaryPageUIState;
};

export type AppStoreActions = {
  setTheme: (theme: AppTheme) => void;
  setMode: (mode: AppMode) => void;
  setNavPanelFolded: (folded: boolean) => void;
  selectChatbox: (chatboxId: string | null) => void;
  toggleGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
};

export type AppStore = AppStoreState & AppStoreActions;

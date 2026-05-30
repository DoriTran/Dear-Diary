export type AppTheme = 'wheat' | 'blush' | 'lavender' | 'mint';

export type AppMode = 'light' | 'dark';

export type AppStoreState = {
  theme: AppTheme;
  mode: AppMode;
  folded: boolean;
};

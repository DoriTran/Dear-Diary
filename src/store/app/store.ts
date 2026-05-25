import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AppMode, AppStoreState, AppTheme } from './type';

import { idbStorage } from '../helper';
import shallow from '../shallow';
import { DEFAULT_MODE, DEFAULT_THEME, THEME_OPTIONS } from './constants';

type Actions = {
  setTheme: (theme: AppTheme) => void;
  setMode: (mode: AppMode) => void;
};

export function applyAppTheme(theme: AppTheme, mode: AppMode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-mode', mode);
}

const useAppStoreBase = create<AppStoreState & Actions>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      mode: DEFAULT_MODE,

      setTheme: (theme) =>
        set((state) => {
          applyAppTheme(theme, state.mode);
          return { theme };
        }),

      setMode: (mode) =>
        set((state) => {
          applyAppTheme(state.theme, mode);
          return { mode };
        }),
    }),
    {
      name: 'dear-diary-app',
      storage: idbStorage,
      partialize: (state) => ({
        theme: state.theme,
        mode: state.mode,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const persisted = state.theme as string;
        const theme = THEME_OPTIONS.some((o) => o.id === persisted)
          ? (persisted as AppTheme)
          : DEFAULT_THEME;

        if (theme !== state.theme) {
          useAppStoreBase.setState({ theme });
        }

        applyAppTheme(theme, state.mode);
      },
    },
  ),
);

export const useAppStore = shallow(useAppStoreBase);

applyAppTheme(DEFAULT_THEME, DEFAULT_MODE);

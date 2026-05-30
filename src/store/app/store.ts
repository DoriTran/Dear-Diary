import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppMode, AppStoreState, AppTheme } from './type';

import shallow from '../shallow';
import { DEFAULT_FOLDED, DEFAULT_MODE, DEFAULT_THEME } from './constants';

type Actions = {
  setTheme: (theme: AppTheme) => void;
  setMode: (mode: AppMode) => void;
  setFolded: (folded: boolean) => void;
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
      folded: DEFAULT_FOLDED,

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

      setFolded: (folded) => set({ folded }),
    }),
    {
      name: 'dear-diary-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        mode: state.mode,
        folded: state.folded,
      }),
    },
  ),
);

export const useAppStore = shallow(useAppStoreBase);

const { theme, mode } = useAppStoreBase.getState();
applyAppTheme(theme, mode);

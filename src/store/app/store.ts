import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppMode, AppStore, AppTheme } from './type';

import shallow from '../shallow';
import {
  DEFAULT_DIARY_PAGE,
  DEFAULT_MODE,
  DEFAULT_NAV_PANEL,
  DEFAULT_THEME,
} from './constants';

const ensureUnique = <T>(items: T[]) => Array.from(new Set(items));

export function applyAppTheme(theme: AppTheme, mode: AppMode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-mode', mode);
}

const useAppStoreBase = create<AppStore>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      mode: DEFAULT_MODE,
      navPanel: DEFAULT_NAV_PANEL,
      diaryPage: DEFAULT_DIARY_PAGE,

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

      setNavPanelFolded: (folded) =>
        set((state) => ({
          navPanel: {
            ...state.navPanel,
            folded,
          },
        })),

      selectChatbox: (chatboxId) =>
        set((state) => ({
          diaryPage: {
            ...state.diaryPage,
            selectedChatboxId: chatboxId,
          },
        })),

      toggleGroup: (groupId) =>
        set((state) => {
          const expanded = state.diaryPage.expandedGroupIds.includes(groupId);

          return {
            diaryPage: {
              ...state.diaryPage,
              expandedGroupIds: expanded
                ? state.diaryPage.expandedGroupIds.filter(
                    (id) => id !== groupId,
                  )
                : [...state.diaryPage.expandedGroupIds, groupId],
            },
          };
        }),

      expandGroup: (groupId) =>
        set((state) => ({
          diaryPage: {
            ...state.diaryPage,
            expandedGroupIds: ensureUnique([
              ...state.diaryPage.expandedGroupIds,
              groupId,
            ]),
          },
        })),

      collapseGroup: (groupId) =>
        set((state) => ({
          diaryPage: {
            ...state.diaryPage,
            expandedGroupIds: state.diaryPage.expandedGroupIds.filter(
              (id) => id !== groupId,
            ),
          },
        })),
    }),
    {
      name: 'dear-diary-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        mode: state.mode,
        navPanel: state.navPanel,
        diaryPage: state.diaryPage,
      }),
    },
  ),
);

export const useAppStore = shallow(useAppStoreBase);

const { theme, mode } = useAppStoreBase.getState();
applyAppTheme(theme, mode);

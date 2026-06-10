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
          const next = new Set(state.diaryPage.expandedGroupIds);

          if (next.has(groupId)) {
            next.delete(groupId);
          } else {
            next.add(groupId);
          }

          return {
            diaryPage: {
              ...state.diaryPage,
              expandedGroupIds: next,
            },
          };
        }),

      expandGroup: (groupId) =>
        set((state) => {
          const next = new Set(state.diaryPage.expandedGroupIds);
          next.add(groupId);

          return {
            diaryPage: {
              ...state.diaryPage,
              expandedGroupIds: next,
            },
          };
        }),

      collapseGroup: (groupId) =>
        set((state) => {
          const next = new Set(state.diaryPage.expandedGroupIds);
          next.delete(groupId);

          return {
            diaryPage: {
              ...state.diaryPage,
              expandedGroupIds: next,
            },
          };
        }),
    }),
    {
      name: 'dear-diary-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        mode: state.mode,
        navPanel: state.navPanel,
        diaryPage: {
          selectedChatboxId: state.diaryPage.selectedChatboxId,
          expandedGroupIds: Array.from(state.diaryPage.expandedGroupIds),
        },
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          theme?: AppTheme;
          mode?: AppMode;
          navPanel?: typeof DEFAULT_NAV_PANEL;
          diaryPage?: {
            selectedChatboxId?: string | null;
            expandedGroupIds?: string[];
          };
        };

        return {
          ...currentState,
          ...persisted,
          navPanel: {
            ...currentState.navPanel,
            ...persisted.navPanel,
          },
          diaryPage: {
            ...currentState.diaryPage,
            ...persisted.diaryPage,
            expandedGroupIds: new Set(
              persisted.diaryPage?.expandedGroupIds ?? [],
            ),
          },
        };
      },
    },
  ),
);

export const useAppStore = shallow(useAppStoreBase);

const { theme, mode } = useAppStoreBase.getState();
applyAppTheme(theme, mode);

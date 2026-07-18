import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppMode, AppTheme } from '../app/type';
import type { DeepPartial, SettingsPreferences, SettingsStore } from './type';

import shallow from '../shallow';
import { DEFAULT_MODE, DEFAULT_PREFERENCES, DEFAULT_THEME } from './constants';

export function applyAppTheme(theme: AppTheme, mode: AppMode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-mode', mode);
}

/** Deep-merge helper used for partial preference updates (immutable). */
function mergePreferences(
  base: SettingsPreferences,
  patch: DeepPartial<SettingsPreferences>,
): SettingsPreferences {
  const result = { ...base } as Record<string, unknown>;

  for (const key of Object.keys(patch) as Array<keyof SettingsPreferences>) {
    const patchValue = patch[key];

    if (patchValue == null) {
      continue;
    }

    if (
      typeof patchValue === 'object' &&
      !Array.isArray(patchValue) &&
      typeof base[key] === 'object'
    ) {
      result[key] = {
        ...(base[key] as Record<string, unknown>),
        ...(patchValue as Record<string, unknown>),
      };
    } else {
      result[key] = patchValue;
    }
  }

  return result as SettingsPreferences;
}

const useSettingsStoreBase = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      mode: DEFAULT_MODE,
      preferences: DEFAULT_PREFERENCES,

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

      updatePreferences: (patch) =>
        set((state) => ({
          preferences: mergePreferences(state.preferences, patch),
        })),

      resetToDefaults: () =>
        set(() => {
          applyAppTheme(DEFAULT_THEME, DEFAULT_MODE);
          return {
            theme: DEFAULT_THEME,
            mode: DEFAULT_MODE,
            preferences: DEFAULT_PREFERENCES,
          };
        }),
    }),
    {
      name: 'dear-diary-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        mode: state.mode,
        preferences: state.preferences,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<{
          theme: AppTheme;
          mode: AppMode;
          preferences: DeepPartial<SettingsPreferences>;
        }>;

        return {
          ...currentState,
          theme: persisted.theme ?? currentState.theme,
          mode: persisted.mode ?? currentState.mode,
          preferences: mergePreferences(
            currentState.preferences,
            persisted.preferences ?? {},
          ),
        };
      },
    },
  ),
);

export const useSettingsStore = shallow(useSettingsStoreBase);

const { theme, mode } = useSettingsStoreBase.getState();
applyAppTheme(theme, mode);

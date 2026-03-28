import type { StoreApi, UseBoundStore } from 'zustand';

import { useShallow } from 'zustand/react/shallow';

function shallow<T extends object>(useBoundStore: UseBoundStore<StoreApi<T>>) {
  function useShallowSlice<K extends keyof T>(key: K): T[K];
  function useShallowSlice<K extends keyof T>(keys: readonly K[]): Pick<T, K>;
  function useShallowSlice<K extends keyof T>(
    keyOrKeys: K | readonly K[],
  ): T[K] | Pick<T, K> {
    return useBoundStore(
      useShallow((state: T) => {
        if (Array.isArray(keyOrKeys)) {
          const slice = {} as Pick<T, K>;
          for (const key of keyOrKeys) {
            const k = key as K;
            slice[k] = state[k];
          }
          return slice;
        }
        return state[keyOrKeys as K];
      }),
    );
  }
  return useShallowSlice;
}

export default shallow;

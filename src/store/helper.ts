import { get, set, del } from 'idb-keyval';
import { createJSONStorage } from 'zustand/middleware';

export const idbStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: any) => {
    await set(name, value);
  },
  removeItem: async (name: string) => {
    await del(name);
  },
}));

export function nowIso() {
  return new Date().toISOString();
}

export function getNewOrder(prev?: number, next?: number) {
  if (prev == null && next == null) return 1;
  if (prev == null) return next! - 1;
  if (next == null) return prev + 1;
  return (prev + next) / 2;
}

export function normalizeOrder<T extends { order: number }>(items: T[]) {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

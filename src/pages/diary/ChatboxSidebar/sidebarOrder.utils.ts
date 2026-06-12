import type { DiaryStore, Orders } from '@/store/diary/type';

import type { SidebarLayout, SidebarRow } from './sidebar.types';

export const clampIndex = (index: number, length: number) => {
  if (Number.isNaN(index)) return length;
  if (index < 0) return 0;
  if (index > length) return length;
  return index;
};

export const swapArray = <T>(
  input: readonly T[],
  x: number,
  y: number,
): readonly T[] => {
  if (x === y) return input;
  if (x < 0 || y < 0) return input;
  if (x >= input.length || y >= input.length) return input;

  const next = input.slice();
  [next[x], next[y]] = [next[y], next[x]];
  return next;
};

export const addArray = <T>(
  input: readonly T[],
  at: number,
  data: T,
): readonly T[] => {
  const insertAt = clampIndex(at, input.length);
  const next = input.slice();
  next.splice(insertAt, 0, data);
  return next;
};

export const removeArray = <T>(
  input: readonly T[],
  at: number,
): readonly T[] => {
  if (at < 0 || at >= input.length) return input;
  const next = input.slice();
  next.splice(at, 1);
  return next;
};

const isGroupId = (id: string, groups: DiaryStore['groups']) =>
  Boolean(groups[id]);

export const buildRowsFromOrders = (
  orders: Orders,
  groups: DiaryStore['groups'],
): SidebarRow[] => {
  const { rootOrders, groupChatboxOrders } = orders;

  return rootOrders
    .map((id): SidebarRow | null => {
      if (isGroupId(id, groups)) {
        return {
          type: 'group',
          id,
          chatboxIds: [...(groupChatboxOrders[id] ?? [])],
        };
      }

      return { type: 'chatbox', id };
    })
    .filter((row): row is SidebarRow => row !== null);
};

export const rowsToOrders = (rows: readonly SidebarRow[]): SidebarLayout => {
  const rootOrders: string[] = [];
  const groupChatboxOrders: Record<string, string[]> = {};

  rows.forEach((row) => {
    if (row.type === 'group') {
      rootOrders.push(row.id);
      groupChatboxOrders[row.id] = [...row.chatboxIds];
      return;
    }

    rootOrders.push(row.id);
  });

  return { rootOrders, groupChatboxOrders };
};

export const chatboxIdFromDragData = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') return null;
  const payload = data as { kind?: string; id?: string };
  if (payload.kind !== 'chatbox' || typeof payload.id !== 'string') return null;
  return payload.id;
};

export const groupIdFromDragData = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') return null;
  const payload = data as { kind?: string; id?: string };
  if (payload.kind !== 'group' || typeof payload.id !== 'string') return null;
  return payload.id;
};

export const rowFromDragData = (
  data: unknown,
  rows: readonly SidebarRow[],
): SidebarRow | null => {
  const chatboxId = chatboxIdFromDragData(data);

  if (chatboxId) {
    return { type: 'chatbox', id: chatboxId };
  }

  const groupId = groupIdFromDragData(data);

  if (!groupId) {
    return null;
  }

  const existing = rows.find(
    (row): row is Extract<SidebarRow, { type: 'group' }> =>
      row.type === 'group' && row.id === groupId,
  );

  return (
    existing ?? {
      type: 'group',
      id: groupId,
      chatboxIds: [],
    }
  );
};

export const layoutsEqual = (a: SidebarLayout, b: SidebarLayout): boolean => {
  if (a.rootOrders.length !== b.rootOrders.length) {
    return false;
  }

  for (let index = 0; index < a.rootOrders.length; index += 1) {
    if (a.rootOrders[index] !== b.rootOrders[index]) {
      return false;
    }
  }

  const groupIds = new Set([
    ...Object.keys(a.groupChatboxOrders),
    ...Object.keys(b.groupChatboxOrders),
  ]);

  for (const groupId of groupIds) {
    const left = a.groupChatboxOrders[groupId] ?? [];
    const right = b.groupChatboxOrders[groupId] ?? [];

    if (left.length !== right.length) {
      return false;
    }

    for (let index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) {
        return false;
      }
    }
  }

  return true;
};

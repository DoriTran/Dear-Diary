import type { ColorId, CustomPalette } from '@/packages/color';

import {
  DEFAULT_COLOR_ID,
  migrateHexToColorId,
  normalizeColorId,
} from '@/packages/color';

type LegacyColorEntity = {
  color?: string;
  colorId?: ColorId;
};

export const migrateEntityColorId = <T extends LegacyColorEntity>(
  entity: T,
  customPalettes: Record<string, CustomPalette> = {},
): T => {
  if (entity.colorId) {
    const { color: _legacyColor, ...rest } = entity as T & { color?: string };
    return {
      ...rest,
      colorId: normalizeColorId(entity.colorId, customPalettes),
    } as T;
  }

  if (entity.color?.startsWith('#')) {
    const { color: legacyColor, ...rest } = entity as T & { color: string };
    return {
      ...rest,
      colorId: migrateHexToColorId(legacyColor),
    } as T;
  }

  return {
    ...entity,
    colorId: DEFAULT_COLOR_ID,
  } as T;
};

export const migrateDiaryPersistedState = <
  T extends {
    groups: Record<string, LegacyColorEntity>;
    chatboxes: Record<string, LegacyColorEntity>;
    tags: Record<string, LegacyColorEntity>;
    customPalettes?: Record<string, CustomPalette>;
  },
>(
  state: T,
): T => {
  const customPalettes = state.customPalettes ?? {};

  const groups = Object.fromEntries(
    Object.entries(state.groups).map(([id, group]) => [
      id,
      migrateEntityColorId(group, customPalettes),
    ]),
  );

  const chatboxes = Object.fromEntries(
    Object.entries(state.chatboxes).map(([id, chatbox]) => [
      id,
      migrateEntityColorId(chatbox, customPalettes),
    ]),
  );

  const tags = Object.fromEntries(
    Object.entries(state.tags).map(([id, tag]) => [
      id,
      migrateEntityColorId(tag, customPalettes),
    ]),
  );

  return {
    ...state,
    groups,
    chatboxes,
    tags,
    customPalettes,
  };
};

export const migrateWorkspacePersistedState = <
  T extends {
    workspaces: Record<string, LegacyColorEntity>;
  },
>(
  state: T,
): T => ({
  ...state,
  workspaces: Object.fromEntries(
    Object.entries(state.workspaces).map(([id, workspace]) => [
      id,
      migrateEntityColorId(workspace),
    ]),
  ),
});

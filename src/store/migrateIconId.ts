import { migrateIconId } from '@/packages/icon';

type LegacyIconEntity = {
  icon?: string;
};

export const migrateEntityIconId = <T extends LegacyIconEntity>(
  entity: T,
): T => ({
  ...entity,
  icon: migrateIconId(entity.icon),
});

export const migrateDiaryIconState = <
  T extends {
    groups: Record<string, LegacyIconEntity>;
    chatboxes: Record<string, LegacyIconEntity>;
  },
>(
  state: T,
): T => ({
  ...state,
  groups: Object.fromEntries(
    Object.entries(state.groups).map(([id, group]) => [
      id,
      migrateEntityIconId(group),
    ]),
  ),
  chatboxes: Object.fromEntries(
    Object.entries(state.chatboxes).map(([id, chatbox]) => [
      id,
      migrateEntityIconId(chatbox),
    ]),
  ),
});

export const migrateWorkspaceIconState = <
  T extends {
    workspaces: Record<string, LegacyIconEntity>;
  },
>(
  state: T,
): T => ({
  ...state,
  workspaces: Object.fromEntries(
    Object.entries(state.workspaces).map(([id, workspace]) => [
      id,
      migrateEntityIconId(workspace),
    ]),
  ),
});

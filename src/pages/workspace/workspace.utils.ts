import type { Chatbox } from '@/store/diary/type';
import { DEFAULT_COLOR_ID, getAppMode, resolvePalette } from '@/packages/color';
import type { CustomPalette } from '@/packages/color';
import type { AppMode } from '@/store/app/type';
import type {
  RecordSource,
  SchedulerEventPayload,
  Workspace,
  WorkspaceRecord,
  WorkspaceSource,
  WorkspaceType,
} from '@/store/workspace/type';

export const WORKSPACE_LOCAL_SOURCE_COLOR_ID = DEFAULT_COLOR_ID;

export const WORKSPACE_LOCAL_SOURCE_LABEL = 'Workspace Data';

export const WORKSPACE_TYPE_LABELS: Record<WorkspaceType, string> = {
  scheduler: 'Scheduler',
  analytics: 'Analytics',
  tracker: 'Tracker',
  kanban: 'Kanban',
  habit: 'Habit',
  finance: 'Finance',
  custom: 'Custom',
};

export const WORKSPACE_TYPE_ORDER: WorkspaceType[] = [
  'scheduler',
  'analytics',
  'tracker',
  'kanban',
  'habit',
  'finance',
  'custom',
];

export const QUICK_ACCESS_WORKSPACE_IDS = [
  'ws:daily-work',
  'ws:study-progress',
  'ws:habit-tracker',
] as const;

export type RecordSourceMeta = {
  label: string;
  color: string;
};

export type WorkspacesByType = {
  type: WorkspaceType;
  label: string;
  workspaces: Workspace[];
};

export const getWorkspaceSources = (
  workspace: Workspace | undefined,
  sources: Record<string, WorkspaceSource>,
): WorkspaceSource[] => {
  if (!workspace) {
    return [];
  }

  return workspace.sourceIds
    .map((sourceId) => sources[sourceId])
    .filter((source): source is WorkspaceSource => Boolean(source));
};

export const getWorkspaceRecords = (
  workspaceId: string | null | undefined,
  records: Record<string, WorkspaceRecord>,
): WorkspaceRecord[] => {
  if (!workspaceId) {
    return [];
  }

  return Object.values(records).filter(
    (record) => record.workspaceId === workspaceId,
  );
};

export const groupWorkspacesByType = (
  workspaces: Record<string, Workspace>,
  workspaceIds: string[],
): WorkspacesByType[] => {
  const grouped = new Map<WorkspaceType, Workspace[]>();

  workspaceIds.forEach((workspaceId) => {
    const workspace = workspaces[workspaceId];

    if (!workspace) {
      return;
    }

    const current = grouped.get(workspace.type) ?? [];

    grouped.set(workspace.type, [...current, workspace]);
  });

  return WORKSPACE_TYPE_ORDER.filter((type) => grouped.has(type)).map(
    (type) => ({
      type,
      label: WORKSPACE_TYPE_LABELS[type],
      workspaces: grouped.get(type) ?? [],
    }),
  );
};

export const getRecentWorkspaces = (
  workspaces: Record<string, Workspace>,
  workspaceIds: string[],
  limit = 3,
): Workspace[] => {
  return workspaceIds
    .map((id) => workspaces[id])
    .filter((workspace): workspace is Workspace => Boolean(workspace))
    .slice(0, limit);
};

export const resolveWorkspaceForToolType = (
  type: WorkspaceType,
  workspaces: Record<string, Workspace>,
  workspaceIds: string[],
  lastUsedByType: Partial<Record<WorkspaceType, string>>,
): string | null => {
  const lastUsedId = lastUsedByType[type];

  if (lastUsedId && workspaces[lastUsedId]?.type === type) {
    return lastUsedId;
  }

  return workspaceIds.find((id) => workspaces[id]?.type === type) ?? null;
};

const resolveEntityMainColor = (
  colorId: string | undefined,
  mode: AppMode = getAppMode(),
  customPalettes: Record<string, CustomPalette> = {},
): string => {
  if (!colorId) {
    return resolvePalette(DEFAULT_COLOR_ID, mode, customPalettes).main;
  }

  return resolvePalette(colorId as import('@/packages/color').ColorId, mode, customPalettes).main;
};

export const resolveRecordSourceMeta = (
  source: RecordSource,
  sources: WorkspaceSource[],
  chatboxes: Record<string, Chatbox>,
  mode: AppMode = getAppMode(),
  customPalettes: Record<string, CustomPalette> = {},
): RecordSourceMeta => {
  if (source.type === 'local') {
    return {
      label: WORKSPACE_LOCAL_SOURCE_LABEL,
      color: resolveEntityMainColor(WORKSPACE_LOCAL_SOURCE_COLOR_ID, mode, customPalettes),
    };
  }

  if (source.type === 'chatbox') {
    const chatboxSource = sources.find(
      (item) =>
        item.type === 'chatbox' && item.chatboxId === source.chatboxId,
    );

    const chatbox = chatboxes[source.chatboxId];

    return {
      label: chatboxSource?.label ?? chatbox?.name ?? 'Chatbox',
      color: resolveEntityMainColor(chatbox?.colorId, mode, customPalettes),
    };
  }

  if (source.type === 'message') {
    return {
      label: 'Message',
      color: resolvePalette('navy', mode, customPalettes).main,
    };
  }

  return {
    label: 'Workspace',
    color: resolvePalette('navy', mode, customPalettes).main,
  };
};

export const resolveSourceChipMeta = (
  source: WorkspaceSource,
  chatboxes: Record<string, Chatbox>,
  mode: AppMode = getAppMode(),
  customPalettes: Record<string, CustomPalette> = {},
): RecordSourceMeta => {
  if (source.type === 'chatbox') {
    const chatbox = chatboxes[source.chatboxId];

    return {
      label: source.label,
      color: resolveEntityMainColor(chatbox?.colorId, mode, customPalettes),
    };
  }

  return {
    label: source.label,
    color: resolvePalette('navy', mode, customPalettes).main,
  };
};

export const isSchedulerEventRecord = (
  record: WorkspaceRecord,
): record is WorkspaceRecord & { payload: SchedulerEventPayload } => {
  return record.type === 'scheduler-event';
};

export const getSchedulerPayload = (
  record: WorkspaceRecord,
): SchedulerEventPayload | null => {
  if (!isSchedulerEventRecord(record)) {
    return null;
  }

  return record.payload as SchedulerEventPayload;
};

export const countRecordsBySource = (
  records: WorkspaceRecord[],
  sources: WorkspaceSource[],
): { source: WorkspaceSource; count: number }[] => {
  return sources.map((source) => {
    const count = records.filter((record) => {
      if (source.type === 'chatbox' && record.source.type === 'chatbox') {
        return record.source.chatboxId === source.chatboxId;
      }

      return false;
    }).length;

    return { source, count };
  });
};

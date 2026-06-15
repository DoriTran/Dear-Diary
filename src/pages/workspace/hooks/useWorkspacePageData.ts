import { useMemo } from 'react';

import { useDiaryStore, useWorkspaceStore } from '@/store';

import {
  getRecentWorkspaces,
  getWorkspaceRecords,
  getWorkspaceSources,
  groupWorkspacesByType,
  QUICK_ACCESS_WORKSPACE_IDS,
} from '../workspace.utils';

export const useWorkspacePageData = () => {
  const workspaces = useWorkspaceStore('workspaces');
  const sources = useWorkspaceStore('sources');
  const records = useWorkspaceStore('records');
  const orders = useWorkspaceStore('orders');
  const ui = useWorkspaceStore('ui');
  const chatboxes = useDiaryStore('chatboxes');

  const selectedWorkspace = ui.selectedWorkspaceId
    ? workspaces[ui.selectedWorkspaceId]
    : undefined;

  const selectedRecord = ui.selectedRecordId
    ? records[ui.selectedRecordId]
    : undefined;

  const workspaceSources = useMemo(
    () => getWorkspaceSources(selectedWorkspace, sources),
    [selectedWorkspace, sources],
  );

  const workspaceRecords = useMemo(
    () => getWorkspaceRecords(ui.selectedWorkspaceId, records),
    [ui.selectedWorkspaceId, records],
  );

  const groupedWorkspaces = useMemo(
    () => groupWorkspacesByType(workspaces, orders.workspaceIds),
    [workspaces, orders.workspaceIds],
  );

  const quickAccessWorkspaces = useMemo(
    () =>
      QUICK_ACCESS_WORKSPACE_IDS.map((id) => workspaces[id]).filter(Boolean),
    [workspaces],
  );

  const recentWorkspaces = useMemo(
    () => getRecentWorkspaces(workspaces, orders.workspaceIds),
    [workspaces, orders.workspaceIds],
  );

  return {
    workspaces,
    sources,
    records,
    orders,
    ui,
    chatboxes,
    selectedWorkspace,
    selectedRecord,
    workspaceSources,
    workspaceRecords,
    groupedWorkspaces,
    quickAccessWorkspaces,
    recentWorkspaces,
  };
};

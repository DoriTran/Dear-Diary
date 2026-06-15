import type { FC } from 'react';

import type {
  Workspace,
  WorkspaceRecord,
  WorkspaceSource,
} from '@/store/workspace/type';

export type WorkspaceToolRendererProps = {
  workspace: Workspace;
  sources: WorkspaceSource[];
  records: WorkspaceRecord[];
  selectedRecordId: string | null;
  onSelectRecord: (recordId: string | null) => void;
};

export type WorkspaceToolRenderer = FC<WorkspaceToolRendererProps>;

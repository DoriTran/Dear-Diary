import type { WorkspaceType } from '@/store/workspace/type';

import PlaceholderTool from './PlaceholderTool/PlaceholderTool';
import SchedulerTool from './scheduler/SchedulerTool';
import type { WorkspaceToolRenderer } from './types';

export const workspaceToolRenderers: Record<
  WorkspaceType,
  WorkspaceToolRenderer
> = {
  scheduler: SchedulerTool,
  analytics: PlaceholderTool,
  tracker: PlaceholderTool,
  kanban: PlaceholderTool,
  habit: PlaceholderTool,
  finance: PlaceholderTool,
  custom: PlaceholderTool,
};

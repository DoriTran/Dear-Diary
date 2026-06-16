import {
  faBookOpen,
  faCalendar,
  faChartColumn,
  faDiceD6,
  faGear,
  faHouse,
  faListCheck,
  faSeedling,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons';

import type { IconValue } from '@/packages/base/AdIcon/AdIcon';
import type { WorkspaceType } from '@/store/workspace/type';

export const navigationPages = [
  'home',
  'diary',
  'workspace',
  'settings',
] as const;

export type NavigationPage = (typeof navigationPages)[number];

export const mainNavigationPages = [
  'home',
  'diary',
  'workspace',
  'settings',
] as const satisfies readonly NavigationPage[];

export const navigationRoutes: Record<NavigationPage, `/${NavigationPage}`> = {
  home: '/home',
  diary: '/diary',
  workspace: '/workspace',
  settings: '/settings',
};

export const navigationLabels: Record<NavigationPage, string> = {
  home: 'Home',
  diary: 'Diary',
  workspace: 'Workspace',
  settings: 'Settings',
};

export const navigationIcons: Record<NavigationPage, IconValue> = {
  home: faHouse,
  diary: faBookOpen,
  workspace: faDiceD6,
  settings: faGear,
};

export const toolsNav = [
  { id: 'scheduler', type: 'scheduler', label: 'Scheduler', icon: faCalendar },
  {
    id: 'analytics',
    type: 'analytics',
    label: 'Analytics',
    icon: faChartColumn,
  },
  { id: 'tracker', type: 'tracker', label: 'Tracker', icon: faListCheck },
  { id: 'kanban', type: 'kanban', label: 'Kanban', icon: faTableColumns },
  { id: 'habit', type: 'habit', label: 'Habit', icon: faSeedling },
] as const satisfies ReadonlyArray<{
  id: string;
  type: WorkspaceType;
  label: string;
  icon: IconValue;
}>;

import {
  faBookOpen,
  faDiceD6,
  faGear,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';

import type { IconValue } from '@/packages/base/AdIcon/AdIcon';

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

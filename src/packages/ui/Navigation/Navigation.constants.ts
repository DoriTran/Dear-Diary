import {
  faBookOpen,
  faDiceD6,
  faGear,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';

import type { IconValue } from '@/packages/base/AdIcon/AdIcon';

import diary from '@/assets/page-circle/diary.png';
import home from '@/assets/page-circle/home.png';
import settings from '@/assets/page-circle/settings.png';
import workspace from '@/assets/page-circle/workspace.png';

export const navigationPages = [
  'home',
  'diary',
  'workspace',
  'settings',
] as const;

export type NavigationPage = (typeof navigationPages)[number];

export const navigationIcons: Record<NavigationPage, IconValue> = {
  home: faHouse,
  diary: faBookOpen,
  workspace: faDiceD6,
  settings: faGear,
};

export const navigationCircles: Record<NavigationPage, string> = {
  home,
  diary,
  workspace,
  settings,
};

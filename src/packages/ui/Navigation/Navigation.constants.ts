import {
  faBookOpen,
  faCalendar,
  faGear,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';

import type { IconValue } from '@/packages/base/AdIcon/AdIcon';

import diary from '@/assets/page-circle/diary.png';
import home from '@/assets/page-circle/home.png';
import scheduler from '@/assets/page-circle/scheduler.png';
import settings from '@/assets/page-circle/settings.png';

export const navigationPages = [
  'home',
  'diary',
  'scheduler',
  'settings',
] as const;

export type NavigationPage = (typeof navigationPages)[number];

export const navigationIcons: Record<NavigationPage, IconValue> = {
  home: faHouse,
  diary: faBookOpen,
  scheduler: faCalendar,
  settings: faGear,
};

export const navigationCircles: Record<NavigationPage, string> = {
  home,
  diary,
  scheduler,
  settings,
};

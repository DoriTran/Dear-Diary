import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export const AD_ICON_KEYS = [
  'faBookOpen',
  'faPenFancy',
  'faBriefcase',
  'faTv',
  'faGamepad',
  'faHeart',
  'faMusic',
  'faBrain',
  'faDumbbell',
  'faCoffee',
  'faLightbulb',
  'faFolder',
] as const;

export type AdIconKey = (typeof AD_ICON_KEYS)[number];

export const resolveAdIcon = (iconKey: string): IconDefinition => {
  return (
    (solidIcons as unknown as Record<string, IconDefinition>)[iconKey] ||
    faQuestion
  );
};

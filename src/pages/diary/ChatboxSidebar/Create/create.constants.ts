import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export const CREATE_ICON_KEYS = [
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

export type CreateIconKey = (typeof CREATE_ICON_KEYS)[number];

export const CREATE_COLOR_SWATCHES = [
  '#E1BEE7',
  '#F8BBD9',
  '#B39DDB',
  '#AED581',
  '#CE93D8',
  '#81D4FA',
  '#FF8A80',
  '#A5D6A7',
] as const;

export const resolveCreateIcon = (iconKey: string): IconDefinition => {
  return (
    (solidIcons as unknown as Record<string, IconDefinition>)[iconKey] ||
    faQuestion
  );
};

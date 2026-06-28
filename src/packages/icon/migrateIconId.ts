import type { IconId } from './types';
import { DEFAULT_ICON_ID } from './presets';
import { isValidIconId } from './iconRegistry';

const FA_TO_LUCIDE: Record<string, IconId> = {
  faBookOpen: 'BookOpen',
  faPenFancy: 'PenLine',
  faBriefcase: 'Briefcase',
  faTv: 'Tv',
  faGamepad: 'Gamepad2',
  faHeart: 'Heart',
  faMusic: 'Music',
  faBrain: 'Brain',
  faDumbbell: 'Dumbbell',
  faCoffee: 'Coffee',
  faLightbulb: 'Lightbulb',
  faFolder: 'Folder',
};

const EMOJI_TO_LUCIDE: Record<string, IconId> = {
  '📅': 'Calendar',
  '📚': 'Library',
  '🏃': 'PersonStanding',
  '📊': 'ChartColumn',
  '😊': 'Smile',
  '💰': 'Wallet',
  '🎬': 'Clapperboard',
  '📖': 'BookOpen',
  '🗂️': 'FolderOpen',
  '✨': 'Sparkles',
  '📁': 'Folder',
  '❤️': 'Heart',
  '❤': 'Heart',
};

const BRACKET_FA_PATTERN = /^\[fa([A-Z][a-zA-Z0-9]*)\]$/;

const faBracketToLucide = (value: string): IconId | null => {
  const match = value.match(BRACKET_FA_PATTERN);

  if (!match) {
    return null;
  }

  const faKey = `fa${match[1]}`;
  return FA_TO_LUCIDE[faKey] ?? null;
};

export const migrateIconId = (value: string | undefined | null): IconId => {
  if (!value) {
    return DEFAULT_ICON_ID;
  }

  if (isValidIconId(value)) {
    return value;
  }

  if (FA_TO_LUCIDE[value]) {
    return FA_TO_LUCIDE[value];
  }

  const bracketLucide = faBracketToLucide(value);

  if (bracketLucide) {
    return bracketLucide;
  }

  if (EMOJI_TO_LUCIDE[value]) {
    return EMOJI_TO_LUCIDE[value];
  }

  return DEFAULT_ICON_ID;
};

export const normalizeIconId = (value: string | undefined | null): IconId =>
  migrateIconId(value);

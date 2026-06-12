import { Flower, Leaf, MoonStar, Wheat, type LucideIcon } from 'lucide-react';

import type {
  AppMode,
  AppTheme,
  DiaryPageUIState,
  NavPanelState,
} from './type';

export const DEFAULT_THEME: AppTheme = 'wheat';
export const DEFAULT_MODE: AppMode = 'light';
export const DEFAULT_FOLDED = false;

export const DEFAULT_NAV_PANEL: NavPanelState = {
  folded: DEFAULT_FOLDED,
};

export const DEFAULT_DIARY_PAGE: DiaryPageUIState = {
  selectedChatboxId: 'cb:study',
  expandedGroupIds: new Set<string>(),
};

export const THEME_OPTIONS: ReadonlyArray<{
  id: AppTheme;
  label: string;
  icon: LucideIcon;
  iconColor: string;
}> = [
  { id: 'wheat', label: 'Wheat', icon: Wheat, iconColor: '#8f6238' },
  { id: 'blush', label: 'Blush', icon: Flower, iconColor: '#e67f96' },
  { id: 'lavender', label: 'Lavender', icon: MoonStar, iconColor: '#a78bfa' },
  { id: 'mint', label: 'Mint', icon: Leaf, iconColor: '#5cb88a' },
];

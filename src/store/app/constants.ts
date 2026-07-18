import type {
  ColorPickerPrefs,
  DiaryPageUIState,
  IconPickerPrefs,
  NavPanelState,
} from './type';

export const DEFAULT_FOLDED = false;

export const DEFAULT_NAV_PANEL: NavPanelState = {
  folded: DEFAULT_FOLDED,
};

export const DEFAULT_DIARY_PAGE: DiaryPageUIState = {
  selectedChatboxId: 'cb:study',
  expandedGroupIds: new Set<string>(),
};

export const DEFAULT_ICON_PICKER_PREFS: IconPickerPrefs = {
  recent: [],
  favorites: [],
};

export const DEFAULT_COLOR_PICKER_PREFS: ColorPickerPrefs = {
  recent: [],
};

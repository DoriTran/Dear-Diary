export type {
  CuratedCategory,
  CuratedCategoryId,
  IconDefinition,
  IconId,
  LibraryCategory,
  LibraryCategoryId,
  LucideIcon,
} from './types';

export {
  CURATED_CATEGORIES,
  DEFAULT_ICON_ID,
  LIBRARY_CATEGORIES,
  LIBRARY_PAGE_SIZE,
  RECENT_ICON_LIMIT,
} from './presets';

export {
  getAllIconIds,
  getAllIcons,
  getCuratedCategories,
  getCuratedCategory,
  getCuratedIconIds,
  getIcon,
  getIconCount,
  getIconCountByLibraryCategory,
  getIconIdsByLibraryCategory,
  getIconLabel,
  getIconsByLibraryCategory,
  isValidIconId,
  searchIcons,
} from './iconRegistry';

export { migrateIconId, normalizeIconId } from './migrateIconId';

export { iconIdToKebab, default as LucideIconById } from './LucideIconById';
export type { LucideIconByIdProps } from './LucideIconById';

export { ICON_COUNT } from './iconRegistryData';

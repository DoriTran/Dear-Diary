import {
  ALL_ICON_IDS,
  ICON_REGISTRY_DATA,
  ICONS_BY_LIBRARY_CATEGORY,
} from './iconRegistryData';
import { CURATED_CATEGORIES } from './presets';
import type {
  CuratedCategory,
  CuratedCategoryId,
  IconDefinition,
  IconId,
  LibraryCategoryId,
} from './types';

export const getIcon = (id: IconId): IconDefinition | null =>
  ICON_REGISTRY_DATA[id] ?? null;

export const getAllIcons = (): IconDefinition[] =>
  ALL_ICON_IDS.map((id) => ICON_REGISTRY_DATA[id]);

export const getAllIconIds = (): IconId[] => ALL_ICON_IDS;

export const isValidIconId = (id: string): id is IconId =>
  id in ICON_REGISTRY_DATA;

export const getIconLabel = (id: IconId): string =>
  ICON_REGISTRY_DATA[id]?.label ?? id;

export const searchIcons = (query: string): IconDefinition[] => {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    return getAllIcons();
  }

  return getAllIcons().filter((icon) => {
    if (icon.id.toLowerCase().includes(trimmed)) {
      return true;
    }

    if (icon.label.toLowerCase().includes(trimmed)) {
      return true;
    }

    return (
      icon.aliases.some((alias) => alias.includes(trimmed)) ||
      icon.keywords.some((keyword) => keyword.includes(trimmed))
    );
  });
};

export const getIconsByLibraryCategory = (
  categoryId: LibraryCategoryId,
): IconDefinition[] => {
  const ids = ICONS_BY_LIBRARY_CATEGORY[categoryId] ?? [];
  return ids.map((id) => ICON_REGISTRY_DATA[id]).filter(Boolean);
};

export const getIconIdsByLibraryCategory = (
  categoryId: LibraryCategoryId,
): IconId[] => ICONS_BY_LIBRARY_CATEGORY[categoryId] ?? [];

export const getCuratedCategories = (): CuratedCategory[] => CURATED_CATEGORIES;

export const getCuratedCategory = (
  id: CuratedCategoryId,
): CuratedCategory | null =>
  CURATED_CATEGORIES.find((category) => category.id === id) ?? null;

export const getCuratedIconIds = (
  categoryId: CuratedCategoryId,
  limit?: number,
): IconId[] => {
  const category = getCuratedCategory(categoryId);

  if (!category) {
    return [];
  }

  const icons = category.icons.filter(isValidIconId);

  return limit ? icons.slice(0, limit) : icons;
};

export const getIconCount = (): number => ALL_ICON_IDS.length;

export const getIconCountByLibraryCategory = (
  categoryId: LibraryCategoryId,
): number => getIconIdsByLibraryCategory(categoryId).length;

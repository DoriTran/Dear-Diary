import type { LucideIcon } from 'lucide-react';

export type IconId = string;

export type CuratedCategoryId =
  | 'study'
  | 'personal'
  | 'work'
  | 'cute'
  | 'productivity';

export type LibraryCategoryId =
  | 'all'
  | 'animals'
  | 'nature'
  | 'food'
  | 'objects'
  | 'ui'
  | 'activities'
  | 'travel'
  | 'people'
  | 'symbols'
  | 'files'
  | 'devices'
  | 'weather'
  | 'emotions'
  | 'others';

export type IconDefinition = {
  id: IconId;
  label: string;
  aliases: string[];
  keywords: string[];
  libraryCategory: LibraryCategoryId;
  kebab: string;
};

export type CuratedCategory = {
  id: CuratedCategoryId;
  label: string;
  iconId: IconId;
  icons: IconId[];
};

export type LibraryCategory = {
  id: LibraryCategoryId;
  label: string;
  iconId: IconId;
};

export type { LucideIcon };

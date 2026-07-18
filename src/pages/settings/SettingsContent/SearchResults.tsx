import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useMemo, type FC } from 'react';

import { AdIcon } from '@/packages/base';

import type { SettingsCategoryId } from '../settings.types';

import {
  SETTINGS_CATEGORIES,
  SETTINGS_SEARCH_INDEX,
} from '../settings.constants';
import styles from './SearchResults.module.css';

export type SearchResultsProps = {
  query: string;
  onNavigate: (category: SettingsCategoryId, subSectionId: string) => void;
};

const categoryLabel = (id: SettingsCategoryId): string =>
  SETTINGS_CATEGORIES.find((category) => category.id === id)?.label ?? id;

const SearchResults: FC<SearchResultsProps> = ({ query, onNavigate }) => {
  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalized) return [];
    return SETTINGS_SEARCH_INDEX.filter((entry) => {
      const haystack = [
        entry.title,
        entry.description,
        categoryLabel(entry.category),
        ...(entry.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [normalized]);

  if (results.length === 0) {
    return (
      <div className={styles.empty}>
        <AdIcon icon={faMagnifyingGlass} size={20} />
        <p className={styles.emptyTitle}>No settings found</p>
        <p className={styles.emptyText}>
          Nothing matched “{query}”. Try a different word.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <p className={styles.count}>
        {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
      </p>
      {results.map((entry) => (
        <button
          className={styles.result}
          key={`${entry.category}-${entry.subSection}-${entry.title}`}
          onClick={() => onNavigate(entry.category, entry.subSection)}
          type="button"
        >
          <span className={styles.resultCategory}>
            {categoryLabel(entry.category)}
          </span>
          <span className={styles.resultTitle}>{entry.title}</span>
          <span className={styles.resultDescription}>{entry.description}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchResults;

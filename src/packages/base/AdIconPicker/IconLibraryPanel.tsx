import { useMemo, useState, type FC } from 'react';

import type {
  CuratedCategoryId,
  IconId,
  LibraryCategoryId,
} from '@/packages/icon';

import {
  getCuratedIconIds,
  getIconCountByLibraryCategory,
  getIconIdsByLibraryCategory,
  ICON_COUNT,
  LucideIconById,
  searchIcons,
} from '@/packages/icon';
import { useAppStore } from '@/store';

import AdSelect from '../AdSelect';
import CategorySidebar from './CategorySidebar';
import IconGrid from './IconGrid';
import styles from './IconLibraryPanel.module.css';
import IconSearchInput from './IconSearchInput';

export type IconLibrarySort = 'az' | 'recent';

const SORT_OPTIONS: { value: IconLibrarySort; label: string }[] = [
  { value: 'az', label: 'A - Z' },
  { value: 'recent', label: 'Recent' },
];

export type IconLibraryPanelProps = {
  value: IconId;
  initialCuratedCategory?: CuratedCategoryId;
  onBack: () => void;
  onClose: () => void;
  onSelect: (iconId: IconId) => void;
};

const IconLibraryPanel: FC<IconLibraryPanelProps> = ({
  value,
  initialCuratedCategory,
  onBack,
  onClose,
  onSelect,
}) => {
  const recent = useAppStore('iconPickerPrefs').recent;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<IconLibrarySort>('az');
  const [category, setCategory] = useState<LibraryCategoryId>('all');

  const baseIconIds = useMemo(() => {
    if (initialCuratedCategory && !query.trim() && category === 'all') {
      return getCuratedIconIds(initialCuratedCategory);
    }

    if (query.trim()) {
      return searchIcons(query).map((icon) => icon.id);
    }

    return getIconIdsByLibraryCategory(category);
  }, [category, initialCuratedCategory, query]);

  const sortedIconIds = useMemo(() => {
    if (sort === 'recent' && recent.length > 0) {
      const recentSet = new Set(recent);
      const recentMatches = baseIconIds.filter((id) => recentSet.has(id));
      const recentOrder = recent.filter((id) => recentMatches.includes(id));
      const rest = baseIconIds
        .filter((id) => !recentSet.has(id))
        .sort((a, b) => a.localeCompare(b));

      return [...recentOrder, ...rest];
    }

    return [...baseIconIds].sort((a, b) => a.localeCompare(b));
  }, [baseIconIds, recent, sort]);

  const handleCategoryChange = (nextCategory: LibraryCategoryId) => {
    setCategory(nextCategory);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.headerRow}>
        <button
          type="button"
          className={styles.backBtn}
          aria-label="Back to icon picker"
          onClick={onBack}
        >
          <LucideIconById iconId="ArrowLeft" size={16} />
        </button>
        <div className={styles.title}>
          <span aria-hidden>✨</span>
          All icons
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close icon picker"
          onClick={onClose}
        >
          <LucideIconById iconId="X" size={14} />
        </button>
      </div>

      <div className={styles.toolbar}>
        <IconSearchInput value={query} onChange={setQuery} />
        <div className={styles.sortSelectWrap}>
          <AdSelect
            label="Sort icons"
            classNames={{
              label: styles.sortSelectLabel,
              input: styles.sortSelectInput,
            }}
            data={SORT_OPTIONS}
            value={sort}
            onChange={(value) => {
              if (value === 'az' || value === 'recent') {
                setSort(value);
              }
            }}
          />
        </div>
      </div>

      <div className={styles.content}>
        <CategorySidebar
          activeCategory={category}
          onChange={handleCategoryChange}
        />

        <div className={styles.main}>
          <p className={styles.count}>
            {query.trim()
              ? `${sortedIconIds.length} results`
              : `${category === 'all' ? ICON_COUNT : getIconCountByLibraryCategory(category)}+ icons`}
          </p>
          <div className={styles.gridScroll}>
            <IconGrid
              iconIds={sortedIconIds}
              selectedId={value}
              onSelect={onSelect}
              onEscape={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconLibraryPanel;

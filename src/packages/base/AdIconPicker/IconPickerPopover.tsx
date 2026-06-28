import { useMemo, useState, type FC } from 'react';

import {
  CURATED_CATEGORIES,
  LucideIconById,
  searchIcons,
} from '@/packages/icon';
import type { CuratedCategoryId, IconId } from '@/packages/icon';

import FavoritesSection from './FavoritesSection';
import IconCategorySection from './IconCategorySection';
import IconGrid from './IconGrid';
import IconLibraryPanel from './IconLibraryPanel';
import IconSearchInput from './IconSearchInput';
import RecentIconsSection from './RecentIconsSection';
import sectionStyles from './iconPickerSections.module.css';
import styles from './IconPickerPopover.module.css';

export type IconPickerPopoverProps = {
  value: IconId;
  onChange: (value: IconId) => void;
  onClose: () => void;
};

type PopoverView = 'home' | 'library';

const IconPickerPopover: FC<IconPickerPopoverProps> = ({
  value,
  onChange,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<PopoverView>('home');
  const [libraryCuratedCategory, setLibraryCuratedCategory] = useState<
    CuratedCategoryId | undefined
  >();

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    return searchIcons(query)
      .slice(0, 32)
      .map((icon) => icon.id);
  }, [query]);

  const handleSelect = (iconId: IconId) => {
    onChange(iconId);
    onClose();
  };

  const openLibrary = (options?: { categoryId?: CuratedCategoryId }) => {
    setLibraryCuratedCategory(options?.categoryId);
    setView('library');
  };

  const handleBackToHome = () => {
    setView('home');
    setLibraryCuratedCategory(undefined);
  };

  const isSearching = query.trim().length > 0;

  if (view === 'library') {
    return (
      <div className={styles.root}>
        <IconLibraryPanel
          value={value}
          initialCuratedCategory={libraryCuratedCategory}
          onBack={handleBackToHome}
          onClose={onClose}
          onSelect={handleSelect}
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <span aria-hidden>✨</span>
          <span>Choose an icon</span>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close icon picker"
          onClick={onClose}
        >
          <LucideIconById iconId="X" size={14} />
        </button>
      </header>

      <div className={styles.searchRow}>
        <IconSearchInput value={query} onChange={setQuery} autoFocus />
        {!isSearching ? (
          <button
            type="button"
            className={sectionStyles.moreIconsBtn}
            onClick={() => openLibrary()}
          >
            <span aria-hidden>✨</span>
            More Icons
          </button>
        ) : null}
      </div>

      <div className={styles.scrollBody}>
        <div className={styles.body}>
          {isSearching ? (
            <section className={styles.searchResults}>
              <h3 className={styles.searchResultsTitle}>
                Results ({searchResults.length})
              </h3>
              <IconGrid
                iconIds={searchResults}
                selectedId={value}
                emptyMessage="No icons match your search"
                onSelect={handleSelect}
                onEscape={onClose}
              />
            </section>
          ) : (
            <>
              <RecentIconsSection
                selectedId={value}
                onSelect={handleSelect}
                onEscape={onClose}
              />
              <FavoritesSection
                selectedId={value}
                onSelect={handleSelect}
                onEscape={onClose}
              />
              {CURATED_CATEGORIES.map((category) => (
                <IconCategorySection
                  key={category.id}
                  categoryId={category.id}
                  selectedId={value}
                  onSelect={handleSelect}
                  onViewAll={(categoryId) =>
                    openLibrary({ categoryId })
                  }
                  onEscape={onClose}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconPickerPopover;

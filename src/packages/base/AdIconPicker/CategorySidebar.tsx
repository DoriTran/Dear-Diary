import { useEffect, useRef, useState, type FC } from 'react';

import type { LibraryCategoryId } from '@/packages/icon';

import {
  getIconCountByLibraryCategory,
  LIBRARY_CATEGORIES,
  LucideIconById,
} from '@/packages/icon';

import styles from './CategorySidebar.module.css';

export type CategorySidebarProps = {
  activeCategory: LibraryCategoryId;
  onChange: (categoryId: LibraryCategoryId) => void;
};

type SidebarCompact = 'full' | 'no-count' | 'icon-count' | 'icon-only';

/** Above this width: icon + label + count */
const NO_COUNT_SIDEBAR_WIDTH_PX = 142;

/** Above this width (while below no-count): icon + label */
const ICON_COUNT_SIDEBAR_WIDTH_PX = 88;

/** Above this width (while below icon-count): icon + count */
const ICON_ONLY_SIDEBAR_WIDTH_PX = 44;

const getSidebarCompact = (width: number): SidebarCompact => {
  if (width <= ICON_ONLY_SIDEBAR_WIDTH_PX) {
    return 'icon-only';
  }

  if (width <= ICON_COUNT_SIDEBAR_WIDTH_PX) {
    return 'icon-count';
  }

  if (width <= NO_COUNT_SIDEBAR_WIDTH_PX) {
    return 'no-count';
  }

  return 'full';
};

const CategorySidebar: FC<CategorySidebarProps> = ({
  activeCategory,
  onChange,
}) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState<SidebarCompact>('full');

  useEffect(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) {
      return;
    }

    const update = () => {
      setCompact(getSidebarCompact(sidebar.clientWidth));
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(sidebar);
    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <nav
      ref={sidebarRef}
      className={styles.sidebar}
      data-compact={compact === 'full' ? undefined : compact}
      aria-label="Icon categories"
    >
      {LIBRARY_CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className={styles.categoryItem}
          data-active={activeCategory === category.id || undefined}
          aria-current={activeCategory === category.id ? 'true' : undefined}
          aria-label={`${category.label} (${getIconCountByLibraryCategory(category.id)} icons)`}
          onClick={() => onChange(category.id)}
        >
          <span className={styles.categoryIcon}>
            <LucideIconById iconId={category.iconId} size={14} />
          </span>
          <span className={styles.categoryLabel}>{category.label}</span>
          <span className={styles.categoryCount}>
            {getIconCountByLibraryCategory(category.id)}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default CategorySidebar;

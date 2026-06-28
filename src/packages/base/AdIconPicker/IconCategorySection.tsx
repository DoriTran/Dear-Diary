import type { FC } from 'react';

import { LucideIconById } from '@/packages/icon';
import type { CuratedCategoryId, IconId } from '@/packages/icon';
import { getCuratedCategory } from '@/packages/icon';

import IconGrid from './IconGrid';
import sectionStyles from './iconPickerSections.module.css';

export type IconCategorySectionProps = {
  categoryId: CuratedCategoryId;
  selectedId?: IconId;
  previewCount?: number;
  onSelect: (iconId: IconId) => void;
  onViewAll: (categoryId: CuratedCategoryId) => void;
  onEscape?: () => void;
};

const IconCategorySection: FC<IconCategorySectionProps> = ({
  categoryId,
  selectedId,
  previewCount = 16,
  onSelect,
  onViewAll,
  onEscape,
}) => {
  const category = getCuratedCategory(categoryId);

  if (!category) {
    return null;
  }

  const icons = category.icons.slice(0, previewCount);

  return (
    <section className={sectionStyles.section}>
      <div className={sectionStyles.sectionHeader}>
        <h3 className={sectionStyles.sectionTitle}>
          <LucideIconById iconId={category.iconId} size={12} />
          {category.label}
        </h3>
        <button
          type="button"
          className={sectionStyles.viewAllBtn}
          onClick={() => onViewAll(categoryId)}
        >
          View all
        </button>
      </div>
      <IconGrid
        iconIds={icons}
        selectedId={selectedId}
        onSelect={onSelect}
        onEscape={onEscape}
      />
    </section>
  );
};

export default IconCategorySection;

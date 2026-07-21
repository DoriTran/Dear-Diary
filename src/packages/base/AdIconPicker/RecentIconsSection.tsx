import type { FC } from 'react';

import type { IconId } from '@/packages/icon';

import { LucideIconById } from '@/packages/icon';
import { useAppStore } from '@/store';

import IconGrid from './IconGrid';
import sectionStyles from './iconPickerSections.module.css';

export type RecentIconsSectionProps = {
  selectedId?: IconId;
  onSelect: (iconId: IconId) => void;
  onEscape?: () => void;
};

const RecentIconsSection: FC<RecentIconsSectionProps> = ({
  selectedId,
  onSelect,
  onEscape,
}) => {
  const recent = useAppStore('iconPickerPrefs').recent;
  const clearRecentIcons = useAppStore('clearRecentIcons');

  if (recent.length === 0) {
    return null;
  }

  return (
    <section className={sectionStyles.section}>
      <div className={sectionStyles.sectionHeader}>
        <h3 className={sectionStyles.sectionTitle}>
          <LucideIconById iconId="Clock" size={12} />
          Frequently Used
        </h3>
        <button
          type="button"
          className={sectionStyles.sectionAction}
          onClick={clearRecentIcons}
        >
          Clear
        </button>
      </div>
      <IconGrid
        iconIds={recent}
        selectedId={selectedId}
        onSelect={onSelect}
        onEscape={onEscape}
      />
    </section>
  );
};

export default RecentIconsSection;

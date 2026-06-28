import type { FC } from 'react';

import { LucideIconById } from '@/packages/icon';
import type { IconId } from '@/packages/icon';
import { useAppStore } from '@/store';

import IconGrid from './IconGrid';
import sectionStyles from './iconPickerSections.module.css';

export type FavoritesSectionProps = {
  selectedId?: IconId;
  onSelect: (iconId: IconId) => void;
  onEscape?: () => void;
};

const FavoritesSection: FC<FavoritesSectionProps> = ({
  selectedId,
  onSelect,
  onEscape,
}) => {
  const favorites = useAppStore('iconPickerPrefs').favorites;

  return (
    <section className={sectionStyles.section}>
      <div className={sectionStyles.sectionHeader}>
        <h3 className={sectionStyles.sectionTitle}>
          <LucideIconById iconId="Star" size={12} />
          Favorites
        </h3>
      </div>
      {favorites.length === 0 ? (
        <p className={sectionStyles.favoriteHint}>
          Right-click an icon to pin or unpin it here.
          <span className={sectionStyles.favoriteHintTouch}>
            On touch devices, press and hold.
          </span>
        </p>
      ) : null}
      {favorites.length > 0 ? (
        <IconGrid
          iconIds={favorites}
          selectedId={selectedId}
          onSelect={onSelect}
          onEscape={onEscape}
        />
      ) : null}
    </section>
  );
};

export default FavoritesSection;

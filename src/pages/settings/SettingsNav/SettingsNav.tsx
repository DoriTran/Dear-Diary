import type { FC } from 'react';

import clsx from 'clsx';

import { AdIcon } from '@/packages/base';

import type { SettingsCategoryId } from '../settings.types';

import { SETTINGS_CATEGORIES } from '../settings.constants';
import styles from './SettingsNav.module.css';

export type SettingsNavProps = {
  activeCategory: SettingsCategoryId;
  onSelectCategory: (category: SettingsCategoryId) => void;
  onSelectSubSection: (
    category: SettingsCategoryId,
    subSectionId: string,
  ) => void;
};

const SettingsNav: FC<SettingsNavProps> = ({
  activeCategory,
  onSelectCategory,
  onSelectSubSection,
}) => {
  return (
    <nav className={styles.nav} aria-label="Settings categories">
      {SETTINGS_CATEGORIES.map((category) => {
        const isActive = category.id === activeCategory;

        return (
          <div className={styles.group} key={category.id}>
            <button
              aria-current={isActive || undefined}
              className={clsx(
                styles.category,
                isActive && styles.categoryActive,
              )}
              data-module="settings"
              onClick={() => onSelectCategory(category.id)}
              type="button"
            >
              <span className={styles.categoryIcon}>
                <AdIcon icon={category.icon} size={15} />
              </span>
              <span className={styles.categoryLabel}>{category.label}</span>
            </button>

            {isActive && category.subSections.length > 1 && (
              <ul className={styles.subList}>
                {category.subSections.map((sub) => (
                  <li key={sub.id}>
                    <button
                      className={styles.subItem}
                      onClick={() => onSelectSubSection(category.id, sub.id)}
                      type="button"
                    >
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default SettingsNav;

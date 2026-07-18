import {
  faArrowsRotate,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AdConfirmDialog, AdIcon } from '@/packages/base';
import LayoutCard from '@/packages/ui/LayoutCard/LayoutCard';
import { useSettingsStore } from '@/store';

import type { SettingsCategoryId } from './settings.types';

import styles from './index.module.css';
import LivePreview from './LivePreview/LivePreview';
import { DEFAULT_CATEGORY } from './settings.constants';
import SettingsContent from './SettingsContent/SettingsContent';
import SettingsNav from './SettingsNav/SettingsNav';

const Settings = () => {
  const resetToDefaults = useSettingsStore('resetToDefaults');

  const [activeCategory, setActiveCategory] =
    useState<SettingsCategoryId>(DEFAULT_CATEGORY);
  const [query, setQuery] = useState('');
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [scrollNonce, setScrollNonce] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelectCategory = useCallback((category: SettingsCategoryId) => {
    setQuery('');
    setActiveCategory(category);
    setScrollTarget(null);
  }, []);

  const handleNavigate = useCallback(
    (category: SettingsCategoryId, subSectionId: string) => {
      setQuery('');
      setActiveCategory(category);
      setScrollTarget(subSectionId);
      setScrollNonce((nonce) => nonce + 1);
    },
    [],
  );

  return (
    <div className={styles.page} data-module="settings">
      <LayoutCard className={styles.navColumn}>
        <div className={styles.navHeader}>
          <h1 className={styles.navTitle}>Settings</h1>
          <p className={styles.navSubtitle}>
            Customize Dear Diary. Make it truly yours.
          </p>
        </div>
        <SettingsNav
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onSelectSubSection={handleNavigate}
        />
      </LayoutCard>

      <LayoutCard className={styles.mainColumn} tag="main">
        <header className={styles.toolbar}>
          <div className={styles.search}>
            <AdIcon icon={faMagnifyingGlass} size={14} />
            <input
              className={styles.searchInput}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search settings…"
              ref={searchRef}
              type="text"
              value={query}
            />
            <kbd className={styles.kbd}>⌘K</kbd>
          </div>
          <button
            className={styles.resetButton}
            onClick={() => setResetOpen(true)}
            type="button"
          >
            <AdIcon icon={faArrowsRotate} size={13} />
            <span>Reset to defaults</span>
          </button>
        </header>

        <SettingsContent
          activeCategory={activeCategory}
          key={scrollNonce}
          onNavigate={handleNavigate}
          query={query}
          scrollTarget={scrollTarget}
        />
      </LayoutCard>

      <LayoutCard className={styles.previewColumn} tag="aside">
        <LivePreview />
      </LayoutCard>

      <AdConfirmDialog
        confirmLabel="Reset"
        destructive
        message="This restores all Dear Diary settings — including theme and appearance — to their defaults."
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetToDefaults();
          setResetOpen(false);
        }}
        opened={resetOpen}
        title="Reset all settings?"
      />
    </div>
  );
};

export default Settings;

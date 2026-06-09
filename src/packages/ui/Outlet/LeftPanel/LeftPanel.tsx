import type { FC } from 'react';

import {
  faCalendar,
  faChartColumn,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';

import { AdDivider, AdIcon } from '@/packages/base';
import { useAppStore } from '@/store';

import LayoutCard from '../../LayoutCard/LayoutCard';
import Logo from '../../Logo/Logo';
import ThemeSelection from '../../ThemeSelection/ThemeSelection';
import styles from './LeftPanel.module.css';
import {
  mainNavigationPages,
  navigationIcons,
  navigationLabels,
  navigationRoutes,
  type NavigationPage,
} from './nav.constants';
import ProfileInfo from './ProfileInfo/ProfileInfo';

const toolsNav = [
  { id: 'scheduler', label: 'Scheduler', icon: faCalendar },
  { id: 'analytics', label: 'Analytics', icon: faChartColumn },
] as const;

const systemNav = [
  { id: 'settings', page: 'settings' as const },
  { id: 'theme', label: 'Theme', icon: faWandMagicSparkles },
] as const;

const LeftPanel: FC = () => {
  const { navPanel, setNavPanelFolded } = useAppStore([
    'navPanel',
    'setNavPanelFolded',
  ]);
  const folded = navPanel.folded;
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (page: NavigationPage) =>
    location.pathname === navigationRoutes[page];

  const goToPage = (page: NavigationPage) => {
    void navigate(navigationRoutes[page]);
  };

  const goHome = () => {
    goToPage('home');
  };

  return (
    <LayoutCard
      tag="aside"
      className={styles.panel}
      data-collapsed={folded || undefined}
    >
      <header className={styles.header}>
        <Logo className={styles.headerLogo} image size={folded ? 64 : 100} />
        <Logo className={styles.headerTextLogo} height={84} text />
      </header>

      <nav aria-label="Sidebar" className={styles.nav}>
        <section className={styles.navGroup}>
          <h2 className={styles.groupLabel}>Main</h2>
          <ul className={styles.navList}>
            {mainNavigationPages.map((page) => (
              <li key={page}>
                <button
                  className={styles.navItem}
                  data-active={isActive(page) || undefined}
                  data-module={page}
                  type="button"
                  onClick={() => goToPage(page)}
                >
                  <AdIcon icon={navigationIcons[page]} size={16} />
                  <span>{navigationLabels[page]}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.navGroup}>
          <AdDivider aria-hidden={!folded} className={styles.groupDivider} />
          <h2 className={styles.groupLabel}>Tools</h2>
          <ul className={styles.navList}>
            {toolsNav.map((item) => (
              <li key={item.id}>
                <button
                  className={styles.navItem}
                  data-module={
                    item.id === 'scheduler' ? 'scheduler' : undefined
                  }
                  type="button"
                  onClick={goHome}
                >
                  <AdIcon icon={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.navGroup}>
          <AdDivider aria-hidden={!folded} className={styles.groupDivider} />
          <h2 className={styles.groupLabel}>System</h2>
          <ul className={styles.navList}>
            {systemNav.map((item) =>
              'page' in item ? (
                <li key={item.id}>
                  <button
                    className={styles.navItem}
                    data-active={isActive(item.page) || undefined}
                    data-module={item.page}
                    type="button"
                    onClick={() => goToPage(item.page)}
                  >
                    <AdIcon icon={navigationIcons[item.page]} size={16} />
                    <span>{navigationLabels[item.page]}</span>
                  </button>
                </li>
              ) : (
                <li key={item.id}>
                  <button
                    className={styles.navItem}
                    type="button"
                    onClick={goHome}
                  >
                    <AdIcon icon={item.icon} size={16} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ),
            )}
          </ul>
        </section>
      </nav>

      <section aria-label="Appearance" className={styles.themeSection}>
        <ThemeSelection collapsed={folded} />
      </section>

      <ProfileInfo
        collapsed={folded}
        onToggleCollapse={() => setNavPanelFolded(!folded)}
      />
    </LayoutCard>
  );
};

export default LeftPanel;

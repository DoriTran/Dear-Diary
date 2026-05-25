import {
  faCaretDown,
  faCaretUp,
  faCheck,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { useState, type FC } from 'react';

import type { AppTheme } from '@/store/app/type';

import { AdIcon, AdPopover, AdSwitch } from '@/packages/base';
import { useAppStore } from '@/store';
import { THEME_OPTIONS } from '@/store/app/constants';

import styles from './ThemeSelection.module.css';

const MENU_WIDTH = 200;

type ThemeSelectionProps = {
  collapsed?: boolean;
};

const ThemeSelection: FC<ThemeSelectionProps> = ({ collapsed = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { theme, mode, setTheme, setMode } = useAppStore([
    'theme',
    'mode',
    'setTheme',
    'setMode',
  ]);

  const activeTheme = THEME_OPTIONS.find((item) => item.id === theme);

  const handleThemeSelect = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    setMenuOpen(false);
  };

  const handleModeToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const isMenuOpen = menuOpen && !collapsed;

  return (
    <div className={styles.root} data-collapsed={collapsed || undefined}>
      <div className={styles.bar}>
        <div className={styles.menuSlot}>
          <AdPopover
            classNames={{ dropdown: styles.menu }}
            offset={8}
            onChange={setMenuOpen}
            opened={isMenuOpen}
            position="top-start"
            targetPopupType="listbox"
            width={MENU_WIDTH}
            anchor={
              <button
                aria-expanded={isMenuOpen}
                aria-haspopup="listbox"
                aria-label="Choose theme"
                className={styles.menuTrigger}
                onClick={() => {
                  if (!collapsed) setMenuOpen((open) => !open);
                }}
                type="button"
              >
                <span className={styles.label}>
                  {activeTheme?.label ?? 'Theme'}
                </span>
                <span className={styles.caret}>
                  <AdIcon
                    icon={isMenuOpen ? faCaretUp : faCaretDown}
                    size={12}
                  />
                </span>
              </button>
            }
          >
            <ul
              aria-label="Theme options"
              className={styles.menuList}
              role="listbox"
            >
              {THEME_OPTIONS.map((item) => {
                const isActive = item.id === theme;

                return (
                  <li key={item.id} role="option" aria-selected={isActive}>
                    <button
                      className={styles.menuItem}
                      data-active={isActive}
                      onClick={() => handleThemeSelect(item.id)}
                      type="button"
                    >
                      <span
                        className={styles.menuSwatch}
                        style={{ backgroundColor: item.swatch }}
                      >
                        <AdIcon color="#fff" icon={faSun} size={11} />
                      </span>
                      <span className={styles.menuItemLabel}>{item.label}</span>
                      {isActive && (
                        <span className={styles.menuCheck}>
                          <AdIcon icon={faCheck} size={13} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
              {/* <li aria-hidden className={styles.menuDivider} role="separator" />
              <li>
                <button className={styles.menuAdd} type="button">
                  <AdIcon icon={faPlus} size={12} />
                  <span>Add New Theme</span>
                </button>
              </li> */}
            </ul>
          </AdPopover>
        </div>

        <AdSwitch
          aria-label={
            mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
          }
          className={styles.modeSwitch}
          onSwitch={handleModeToggle}
          value={mode === 'dark'}
        >
          <span className={styles.modeIcon} data-active={mode === 'light'}>
            <AdIcon icon={faMoon} size={collapsed ? 11 : 13} />
          </span>
          <span className={styles.modeIcon} data-active={mode === 'dark'}>
            <AdIcon icon={faSun} size={collapsed ? 12 : 14} />
          </span>
        </AdSwitch>
      </div>
    </div>
  );
};

export default ThemeSelection;

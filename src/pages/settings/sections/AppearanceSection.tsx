import { faPalette, faSliders } from '@fortawesome/free-solid-svg-icons';
import { useState, type CSSProperties, type FC } from 'react';

import type {
  AccentStylePref,
  BorderRadiusPref,
  FontSizePref,
  UiDensity,
} from '@/store/settings/type';

import { AdIcon, AdSegmentedControl, AdSwitch } from '@/packages/base';
import { useSettingsStore } from '@/store';
import { DEFAULT_PREFERENCES, THEME_OPTIONS } from '@/store/settings/constants';

import { SettingCard, SettingRow } from '../components';
import styles from './sections.module.css';

const AppearanceSection: FC = () => {
  const { theme, mode, setTheme, setMode } = useSettingsStore([
    'theme',
    'mode',
    'setTheme',
    'setMode',
  ]);

  // Suggested (not wired) — local ephemeral state so controls feel alive.
  const [density, setDensity] = useState<UiDensity>(
    DEFAULT_PREFERENCES.appearance.density,
  );
  const [radius, setRadius] = useState<BorderRadiusPref>(
    DEFAULT_PREFERENCES.appearance.borderRadius,
  );
  const [fontSize, setFontSize] = useState<FontSizePref>(
    DEFAULT_PREFERENCES.appearance.fontSize,
  );
  const [reduceMotion, setReduceMotion] = useState(
    DEFAULT_PREFERENCES.appearance.reduceMotion,
  );
  const [accentStyle, setAccentStyle] = useState<AccentStylePref>(
    DEFAULT_PREFERENCES.appearance.accentStyle,
  );

  return (
    <>
      <SettingCard
        id="theme"
        icon={faPalette}
        title="Theme & Colors"
        description="Pick a palette that fits your mood."
      >
        <SettingRow
          title="Theme"
          description="Your diary's overall color personality."
          stacked
        >
          <div className={styles.themeGrid}>
            {THEME_OPTIONS.map((option) => (
              <button
                className={styles.themeSwatch}
                data-active={option.id === theme || undefined}
                key={option.id}
                onClick={() => setTheme(option.id)}
                style={{ '--swatch': option.iconColor } as CSSProperties}
                type="button"
              >
                <span className={styles.themeSwatchIcon}>
                  <AdIcon
                    color={option.iconColor}
                    icon={option.icon}
                    size={18}
                    source="lucide"
                    strokeWidth={2}
                  />
                </span>
                <span className={styles.themeSwatchLabel}>{option.label}</span>
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow
          title="Light / Dark mode"
          description="Toggle between light and dark appearance."
          control={
            <AdSegmentedControl
              aria-label="Appearance mode"
              onChange={setMode}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              value={mode}
            />
          }
        />
      </SettingCard>

      <SettingCard
        id="layout"
        icon={faSliders}
        title="Layout & Display"
        description="Fine-tune spacing, sizing and motion."
      >
        <SettingRow
          title="UI Density"
          description="Comfortable gives more breathing room; compact fits more."
          suggested
          control={
            <AdSegmentedControl
              aria-label="UI density"
              onChange={setDensity}
              options={[
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'compact', label: 'Compact' },
              ]}
              value={density}
            />
          }
        />
        <SettingRow
          title="Border Radius"
          description="How rounded cards and controls appear."
          suggested
          control={
            <AdSegmentedControl
              aria-label="Border radius"
              onChange={setRadius}
              options={[
                { value: 'sharp', label: 'Sharp' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'soft', label: 'Soft' },
              ]}
              value={radius}
            />
          }
        />
        <SettingRow
          title="Font Size"
          description="Base text size across the app."
          suggested
          control={
            <AdSegmentedControl
              aria-label="Font size"
              onChange={setFontSize}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
              value={fontSize}
            />
          }
        />
        <SettingRow
          title="Reduce Motion"
          description="Minimize animations and transitions."
          suggested
          control={
            <AdSwitch
              onSwitch={() => setReduceMotion((value) => !value)}
              value={reduceMotion}
            />
          }
        />
        <SettingRow
          title="Accent Style"
          description="How accent colors are applied to buttons and highlights."
          suggested
          control={
            <AdSegmentedControl
              aria-label="Accent style"
              onChange={setAccentStyle}
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'soft', label: 'Soft' },
                { value: 'outline', label: 'Outline' },
              ]}
              value={accentStyle}
            />
          }
        />
      </SettingCard>
    </>
  );
};

export default AppearanceSection;

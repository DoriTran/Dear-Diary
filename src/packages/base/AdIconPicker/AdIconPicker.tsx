import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { CSSProperties, FC } from 'react';

import AdIcon from '../AdIcon/AdIcon';
import styles from './AdIconPicker.module.css';
import { AD_ICON_KEYS, resolveAdIcon } from './iconPresets';

export type AdIconPickerProps = {
  value: string;
  onChange: (value: string) => void;
  icons?: readonly string[];
  resolveIcon?: (key: string) => IconDefinition;
  label?: string;
  columns?: number;
};

const AdIconPicker: FC<AdIconPickerProps> = ({
  value,
  onChange,
  icons = AD_ICON_KEYS,
  resolveIcon = resolveAdIcon,
  label = 'Icon',
  columns = 6,
}) => {
  return (
    <div
      className={styles.field}
      style={{ '--ad-icon-picker-columns': columns } as CSSProperties}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.grid}>
        {icons.map((iconKey) => (
          <button
            key={iconKey}
            type="button"
            className={styles.iconBtn}
            data-selected={iconKey === value || undefined}
            aria-label={iconKey}
            aria-pressed={iconKey === value}
            onClick={() => onChange(iconKey)}
          >
            <AdIcon icon={resolveIcon(iconKey)} size={14} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdIconPicker;

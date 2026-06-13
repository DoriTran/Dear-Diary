import type { CSSProperties, FC } from 'react';

import styles from './AdColorPicker.module.css';
import { AD_COLOR_SWATCHES } from './colorPresets';

export type AdColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
  swatches?: readonly string[];
  label?: string;
  columns?: number;
};

const AdColorPicker: FC<AdColorPickerProps> = ({
  value,
  onChange,
  swatches = AD_COLOR_SWATCHES,
  label = 'Color',
  columns = 8,
}) => {
  return (
    <div
      className={styles.field}
      style={{ '--ad-color-picker-columns': columns } as CSSProperties}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
      <div className={styles.grid}>
        {swatches.map((color) => (
          <button
            key={color}
            type="button"
            className={styles.colorBtn}
            style={{ background: color }}
            data-selected={color === value || undefined}
            aria-label={`Color ${color}`}
            aria-pressed={color === value}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdColorPicker;

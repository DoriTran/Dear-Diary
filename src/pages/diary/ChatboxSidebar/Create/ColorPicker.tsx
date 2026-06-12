import type { FC } from 'react';

import { CREATE_COLOR_SWATCHES } from './create.constants';
import formStyles from './CreateForm.module.css';

export type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const ColorPicker: FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <div className={formStyles.field}>
      <span className={formStyles.label}>Color</span>
      <div className={formStyles.colorGrid}>
        {CREATE_COLOR_SWATCHES.map((color) => (
          <button
            key={color}
            type="button"
            className={formStyles.colorBtn}
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

export default ColorPicker;

import type { FC } from 'react';

import { AdIcon } from '@/packages/base';

import {
  CREATE_ICON_KEYS,
  resolveCreateIcon,
  type CreateIconKey,
} from './create.constants';
import formStyles from './CreateForm.module.css';

export type IconPickerProps = {
  value: CreateIconKey;
  onChange: (value: CreateIconKey) => void;
};

const IconPicker: FC<IconPickerProps> = ({ value, onChange }) => {
  return (
    <div className={formStyles.field}>
      <span className={formStyles.label}>Icon</span>
      <div className={formStyles.pickerGrid}>
        {CREATE_ICON_KEYS.map((iconKey) => (
          <button
            key={iconKey}
            type="button"
            className={formStyles.iconBtn}
            data-selected={iconKey === value || undefined}
            aria-label={iconKey}
            aria-pressed={iconKey === value}
            onClick={() => onChange(iconKey)}
          >
            <AdIcon icon={resolveCreateIcon(iconKey)} size={14} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;

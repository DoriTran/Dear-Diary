import type { FC } from 'react';

import { TimePicker } from '@mantine/dates';
import clsx from 'clsx';

import formFieldStyles from '@/packages/base/formField/formField.module.css';

import styles from './AdDurationPicker.module.css';

export type AdDurationPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
};

const AdDurationPicker: FC<AdDurationPickerProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false,
  className,
}) => {
  return (
    <TimePicker
      withSeconds
      withDropdown
      value={value}
      onChange={(next) => onChange(next ?? '00:00:00')}
      disabled={disabled}
      className={clsx(
        formFieldStyles.control,
        styles.root,
        compact && styles.compact,
        className,
      )}
      classNames={{
        field: styles.field,
      }}
    />
  );
};

export default AdDurationPicker;
